import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable, Column, ManyToOne, CreateDateColumn } from "typeorm"

import { MessageEntity } from "src/message/entities/message.entity"
import { UserEntity } from "src/users/entities/user.entity"

@Entity('chats')
export class ChatEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 255
    })
    name: string

    @Column({
        length: 255
    })
    password: string

    @ManyToOne(() => UserEntity, (user) => user)
    chat_creater: UserEntity

    @CreateDateColumn()
    create_time: Date

    @ManyToMany(() => MessageEntity, (message) => message.chats)
    @JoinTable({
        name: 'chats_and_messages',
    })
    messages: MessageEntity[]

    @ManyToMany(() => UserEntity, (user) => user.chats)
    @JoinTable({
        name: 'user_chats',
    })
    users: UserEntity[]
}
