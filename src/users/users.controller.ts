import { Controller, Get, Post, Body, Param, HttpCode } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@HttpCode(201)
	async create(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}

	@Get(":id")
	@HttpCode(200)
	async findOne(@Param("id") id: string) {
		return await this.usersService.findOne(+id);
	}
}
