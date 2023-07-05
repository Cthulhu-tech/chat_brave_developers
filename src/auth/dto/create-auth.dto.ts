export class CreateAuthDto {
	login: string;
	password: string;
}

export interface JwtPayload {
	userId: string;
}
