import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hash } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ){}

  async create(createUserDto: CreateUserDto) {
    if(!createUserDto.login || !createUserDto.password)
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    const findUser = await this.userRepository.findOneBy({
      login: createUserDto.login,
    })

    if(findUser)
      throw new HttpException('Such user exists', HttpStatus.BAD_REQUEST)

    const createUser = await this.userRepository.create({
      login: createUserDto.login,
      password: await hash(createUserDto.password, 10),
    })

    const userSave = await this.userRepository.save(createUser)

    return {
      login: userSave.login,
      id: userSave.id,
      create_time: userSave.create_time,
    }
  }

  async findOne(id: number) {
    if(!id || isNaN(id))
      throw new HttpException('All fields must be filled', HttpStatus.BAD_REQUEST)

    const findUser = await this.userRepository.findOne({
      where: {
        id,
      }
    })

    if(!findUser) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)

    return {
      login: findUser.login,
      id: findUser.id,
      create_time: findUser.create_time,
    }
  }
}
