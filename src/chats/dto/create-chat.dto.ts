import { UserEntity } from "src/users/entities/user.entity"

export class CreateChatDto {
    name: string
    id?: number
    user?: UserEntity
    password: string
}
