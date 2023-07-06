import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: 'https://main--brave-developers-chat.netlify.app',
		methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
		credentials: true,
		optionsSuccessStatus: 200,
		allowedHeaders:
			"Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
	});
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
	}));
	app.use(cookieParser());
	await app.listen(process.env.PORT || 3000);
}
bootstrap();
