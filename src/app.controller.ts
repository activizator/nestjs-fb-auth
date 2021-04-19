import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@Controller('/user/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET	/user/login	информация о входе, регистрации
  // POST	/user/login	авторизация пользователя
  // POST	/user/signup	регистрация пользователя
  // POST	/user/profile	профиль пользователя
  // POST	/user/logout	выход из системы

  @Get('login')
  loginG(): string {
    return this.appService.getLogin();
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  profileP(@Body() body): any {
    return this.appService.postProfile(body);
  }

  @Post('login')
  loginP(@Body() body): any {
    return this.appService.postLogin(body);
  }

  @Post('signup')
  signupP(@Body() body): any {
    return this.appService.postSignup(body);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logoutP(@Body() body): any {
    return this.appService.postLogout(body);
  }
}
