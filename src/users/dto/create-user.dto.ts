import { IsNotEmpty, Matches, MaxLength, MinLength } from "@nestjs/class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	login: string;
	@IsNotEmpty()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
	password: string;
}
