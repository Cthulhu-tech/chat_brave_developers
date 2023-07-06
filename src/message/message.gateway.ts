import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { CreateMessageDto, JoinRoom } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessageService } from "./message.service";

import { Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: 'https://main--brave-developers-chat.netlify.app',
		methods: ["GET", "POST"],
		credentials: true,
		transports: ["websocket", "polling"],
		optionsSuccessStatus: 200,
		allowedHeaders:
			"Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
	},
	allowEIO3: true,
})
export class MessageGateway implements OnGatewayDisconnect {
	constructor(private readonly messageService: MessageService) {}

	@SubscribeMessage("JOIN_ROOM") 
	joinRoom(@MessageBody() data: JoinRoom, @ConnectedSocket() client: Socket) {
		return this.messageService.joinRoom(data, client);
	}

	@SubscribeMessage("CREATE_MESSAGE")
	create(
		@MessageBody() createMessageDto: CreateMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		return this.messageService.create(createMessageDto, client);
	}

	@SubscribeMessage("FIND_ALL_MESSAGE")
	findAll(
		@MessageBody() updateMessageDto: UpdateMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		return this.messageService.findAll(+updateMessageDto.chatId, client);
	}

	handleDisconnect(client: Socket) {
		return this.messageService.disconnect(client);
	}
}
