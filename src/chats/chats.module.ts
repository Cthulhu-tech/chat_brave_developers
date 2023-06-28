import { ChatsController } from './chats.controller'
import { ChatEntity } from './entities/chat.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatsService } from './chats.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
