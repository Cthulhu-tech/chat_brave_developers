import { UserEntity } from 'src/users/entities/user.entity'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
