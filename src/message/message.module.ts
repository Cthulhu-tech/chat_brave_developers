import { MessageService } from './message.service'
import { MessageGateway } from './message.gateway'
import { Module } from '@nestjs/common'

@Module({
  providers: [MessageGateway, MessageService]
})
export class MessageModule {}
