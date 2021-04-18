import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/user/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET	/user/login	страница с формой входа / регистрации
  // GET	/user/profile	страница профиля
  // POST	/user/login	авторизация пользователя
  // POST	/user/signup	регистрация пользователя
  // POST	/user/logout	выход из системы

  @Get('login')
  loginG(): string {
    return this.appService.getLogin();
  }

  @Get('profile')
  profileG(): string {
    return this.appService.getProfile();
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
  logoutP(@Body() body): any {
    return this.appService.postLogout(body);
  }
}
