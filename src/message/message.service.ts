import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMessageDto, JoinRoom } from "./dto/create-message.dto";
import { ChatEntity } from "src/chats/entities/chat.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { MessageEntity } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Socket } from "socket.io";

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(ChatEntity)
		private chatRepository: Repository<ChatEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	async create(createMessageDto: CreateMessageDto, client: Socket) {
		const user = await this.userRepository.findOneBy({
			id: createMessageDto.user,
		});

		const chat = await this.chatRepository.findOneBy({
			id: createMessageDto.room,
		});

		const createMessage = await this.messageRepository.create({
			message: createMessageDto.message,
			message_creater: user,
			chats: [chat],
		});

		const saveMessage = await this.messageRepository.save(createMessage);

		const returnData = {
			id: saveMessage.id,
			create_time: saveMessage.create_time,
			message_creater: {
				id: saveMessage.message_creater.id,
				login: saveMessage.message_creater.login,
			},
			message: saveMessage.message,
		};
		console.log(
			{ chat: createMessageDto.room.toString() },
			{ data: returnData },
		);
		client.broadcast
			.to(createMessageDto.room.toString())
			.emit("CREATE_MESSAGE", returnData);
		client.emit("CREATE_MESSAGE", returnData);
	}

	async disconnect(client: Socket) {
		client.broadcast.emit("RECEIVE_DISONECT", { user: client.id });
		client.disconnect();
	}

	async findAll(chatId: number, client: Socket) {
		if (!chatId || isNaN(chatId))
			throw new HttpException("All fields must be filled", 401);

		const findRoom = await this.chatRepository.findOneBy({
			id: chatId,
		});

		if (!findRoom) {
			client.emit("FIND_ALL_MESSAGE", { error: "Not found" });
			client.disconnect();
			return;
		}

		const messages = await this.messageRepository
			.createQueryBuilder("message")
			.leftJoin("message.chats", "chats")
			.leftJoin("message.message_creater", "creater")
			.addSelect(["creater.id", "creater.login"])
			.where("chats.id = :id", {
				id: chatId,
			})
			.getMany();

		client.emit("FIND_ALL_MESSAGE", { messages });
	}

	async joinRoom(data: JoinRoom, client: Socket) {
		client.join(data.room_id);
		console.log({ chat: data.room_id });
		client.broadcast.to(data.room_id).emit("RECEIVE_CLIENT_JOINED", {
			user_server_id: client.id,
		});
	}
}
