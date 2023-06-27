import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { AuthService } from './auth.service'
import { Response, Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.refresh(res, req)
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() userLogin: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(userLogin, res)
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(res)
  }
}
