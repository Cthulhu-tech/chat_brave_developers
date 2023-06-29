import * as cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'https://main--brave-developers-chat.netlify.app',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  })
  app.use(cookieParser())
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
