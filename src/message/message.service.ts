import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateMessageDto, JoinRoom} from './dto/create-message.dto'
import { ChatEntity } from 'src/chats/entities/chat.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { MessageEntity } from './entities/message.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){}

  private async searchRoom (data: JoinRoom, client: Socket) {
    const roomId = Number(data?.room_id)
    if(!data?.room_id || isNaN(roomId))
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)
    const findRoom = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .where('chat.id = :id', { 
        id: data.room_id
      })
      .getOne()
    if(!findRoom) {
      client.leave(roomId.toString())
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST)
    }
    return findRoom
  }

  async create(createMessageDto: CreateMessageDto, client: Socket) {
    if(!createMessageDto.message)
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    const user = await this.userRepository.findOneBy({
      id: createMessageDto.user,
    })

    const chat = await this.chatRepository.findOneBy({
      id: createMessageDto.room,
    })

    const createMessage = await this.messageRepository.create({
      message: createMessageDto.message,
      message_creater: user,
      chats: [chat]
    })

    const saveMessage = await this.messageRepository.save(createMessage)

    const returnData = {
      id: saveMessage.id,
      create_time: saveMessage.create_time,
      message_creater: {
        id: saveMessage.message_creater.id,
        login: saveMessage.message_creater.login,
      },
      message: saveMessage.message,
    }

    client.to(chat.id.toString()).emit('CREATE_MESSAGE', returnData)
  }

  async disconnect (client: Socket) {
    client.broadcast.emit('RECEIVE_DISONECT', { user: client.id })
    client.disconnect()
  }

  async findAll(chatId: number, client: Socket) {
    if(!chatId || isNaN(chatId))
      throw new HttpException('All fields must be filled', 20)

    const findRoom = await this.chatRepository.findOneBy({
      id: chatId,
    })

    if(!findRoom) {
      client.emit('FIND_ALL_MESSAGE', { error: 'Not found' })
      client.disconnect()
      return
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.chats', 'chats')
      .leftJoin('message.message_creater', 'creater')
      .addSelect(['creater.id', 'creater.login'])
      .where('chats.id = :id', { 
        id: chatId,
      })
      .getMany()

    client.emit('FIND_ALL_MESSAGE', { messages })
  }

  async joinRoom(data: JoinRoom, client: Socket) {
    client.join(data.room_id)
    client.broadcast.to(data.room_id).emit('RECEIVE_CLIENT_JOINED', {
      user_server_id: client.id,
    })
  }
}
