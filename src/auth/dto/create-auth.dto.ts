import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(20)
	login: string;
	@IsNotEmpty()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
	password: string;
}

export interface JwtPayload {
	userId: string;
}
