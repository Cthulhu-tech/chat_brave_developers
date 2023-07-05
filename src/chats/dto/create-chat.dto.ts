import {
	IsNotEmpty,
	MaxLength,
	MinLength,
} from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";

export class CreateChatDto {
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(55)
	name: string;
	id?: number;
	user?: UserEntity;
	password: string;
}
