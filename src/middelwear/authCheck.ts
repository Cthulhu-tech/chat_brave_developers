import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";

import { Request, Response, NextFunction } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { verify } from "jsonwebtoken";
import { Repository } from "typeorm";

import { UserEntity } from "src/users/entities/user.entity";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	async use(req: Request, _: Response, next: NextFunction) {
		const token = req.headers["authorization"]?.split(" ")[1];
		try {
			const { userId } = verify(token, "access") as { userId: string };
			req.body.user = await this.userRepository.findOne({
				where: {
					id: +userId,
				},
			});
		} catch (err) {
			throw new HttpException("Token not Valid", HttpStatus.UNAUTHORIZED);
		}

		next();
	}
}
