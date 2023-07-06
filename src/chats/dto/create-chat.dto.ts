import {
	IsNotEmpty,
	MaxLength,
	MinLength,
	Matches
} from "class-validator";
import { UserEntity } from "src/users/entities/user.entity";

export class CreateChatDto {
	@IsNotEmpty()
	@MinLength(1)
	@MaxLength(55)
	name: string;
	id?: number;
	user?: UserEntity;
	@IsNotEmpty()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
	password: string;
}
