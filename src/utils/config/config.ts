import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { entities } from "../db/entity";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.host,
			port: Number(process.env.port_sql),
			username: process.env.user,
			password: process.env.password,
			database: process.env.database,
			entities,
			logging: true,
			synchronize: true,
		}),
	],
})
export class CommonConfigModule {}
