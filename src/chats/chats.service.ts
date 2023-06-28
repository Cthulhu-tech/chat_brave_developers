import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { ChatEntity } from './entities/chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Request } from 'express'

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
  ){}

  async create(createChatDto: CreateChatDto) {
    if(!createChatDto.name || !createChatDto.password) 
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    const createChat = await this.chatRepository.create({
      name: createChatDto.name,
      chat_creater: createChatDto.user,
      password: createChatDto.password,
    })

    const saveChat = await this.chatRepository.save(createChat)

    return {
      name: saveChat.name,
      password: saveChat.password,
      chat_creater: {
        login: saveChat.chat_creater.login,
        id: saveChat.chat_creater.id,
        create_time: saveChat.chat_creater.create_time,
      },
      id: saveChat.id,
      create_time: saveChat.create_time
    }
  }

  async getChatById(id: number) {
    if(!id || isNaN(id))
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    return await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoin('chat.messages', 'messages')
    .leftJoin('messages.message_creater', 'creater')
    .where('chat.id = :id', { 
      id,
    })
    .select(['chat', 'messages.create_time', 'messages.message', 'messages.id', 'creater.id', 'creater.login'])
    .getOne()
  }

  async findAll(updateChatDto: UpdateChatDto) {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.users', 'users')
      .leftJoin('chat.chat_creater', 'chat_creater')
      .select(['chat.name', 'chat.id', 'chat.delete', 'chat.create_time', 'chat_creater.id', 'chat_creater.login'])
      .getMany()
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    if(!updateChatDto.name || isNaN(id)) 
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)
    
    const findChat = await this.chatRepository.findOne({
      relations: {
        chat_creater: true
      },
      where: {
        id
      }
    })

    if(!findChat) 
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST)

    if(findChat.chat_creater.id !== updateChatDto.user.id)
      throw new HttpException('Not enough rights', HttpStatus.FORBIDDEN)

    await this.chatRepository.update({ id }, {
      name: updateChatDto.name,
    })

    return {
      message: 'Chat update!'
    }
  }

  async remove(id: number, updateChatDto: UpdateChatDto, req: Request) {
    if(!id || isNaN(id)) 
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    const findChat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'users')
      .where({
        id,
      })
      .getOne()

    if(!findChat) 
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST)

    findChat.users = findChat.users.filter((user) => user.id !== req.body.user.id)

    await this.chatRepository.manager.save(findChat)

    return {
      message: 'Chat delete',
    }
  }
}
