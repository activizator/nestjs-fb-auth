import {
  CanActivate,
  ExecutionContext,
  HttpService,
  Injectable,
} from '@nestjs/common';
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: FirebaseAuthenticationService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken: string = request.body.refreshToken;

    const apiURL = `https://securetoken.googleapis.com/v1/token?key=${this.configService.get<string>(
      'WebAPIKey',
    )}`;

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    let mess: boolean;

    await this.httpService
      .post(apiURL, params, config)
      .toPromise()
      .then((res) => res.data)
      .then((data) => data.id_token)
      .then(async (idToken) => {
        try {
          await this.auth
            .verifyIdToken(idToken)
            .then((decodedToken) => decodedToken.uid)
            .then((uid) => {
              console.log(uid);
              mess = true;
            });
        } catch (error) {
          console.log(error.message);
          mess = false;
        }
      });

    return mess;
  }
}
