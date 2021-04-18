import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // GET	/user/login	страница с формой входа / регистрации
  // GET	/user/profile	страница профиля
  // POST	/user/login	авторизация пользователя
  // POST	/user/signup	регистрация пользователя
  // POST	/user/logout	выход из системы

  getLogin(): string {
    return 'Hello World!';
  }

  getProfile(): any {
    return 'Hello World!';
  }

  postLogin(body): any {
    return 'Hello World!';
  }

  postSignup(body): any {
    return 'Hello World!';
  }

  postLogout(body): any {
    return 'Hello World!';
  }
}
