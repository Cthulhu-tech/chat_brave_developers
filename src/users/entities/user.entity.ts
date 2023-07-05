import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'

import { MessageEntity } from '../../message/entities/message.entity'
import { ChatEntity } from '../../chats/entities/chat.entity'

@Entity('Users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 55
    })
    login: string

    @Column({
        length: 255,
        nullable: true,
    })
    token: string

    @Column({
        length: 535
    })
    password: string
    
    @CreateDateColumn()
    create_time: Date
        
    @OneToMany(() => MessageEntity, (message) => message)
    message: MessageEntity[]

    @OneToMany(() => ChatEntity, (chat) => chat)
    chat: ChatEntity[]
}
