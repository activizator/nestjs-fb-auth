import { HttpService, Injectable } from '@nestjs/common';
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private auth: FirebaseAuthenticationService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getLogin(): string {
    return 'POST /user/signup to create user or /user/login to login to the system!';
  }

  postSignup(body): any {
    const {
      email,
      emailVerified,
      phoneNumber,
      password,
      displayName,
      photoURL,
      disabled,
    } = body;
    const userProp = {
      email,
      emailVerified,
      phoneNumber,
      password,
      displayName,
      photoURL,
      disabled,
    };

    if (!displayName || !password || !email) {
      throw new Error('Missing fields');
    }

    return this.auth
      .createUser(userProp)
      .then((userRecord) => {
        console.log('Successfully created new user:', userRecord);
        return { status: 'ok' };
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
        return { status: 'error', error: error.message };
      });
  }

  async postLogin(body) {
    let { email, password } = body;
    email = email.toString();
    password = password.toString();
    const apiURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.configService.get<string>(
      'WebAPIKey',
    )}`;

    const refreshToken = await this.httpService
      .post(apiURL, { email, password, returnSecureToken: true })
      .toPromise()
      .then((res) => res.data)
      .then((data) => data.refreshToken)
      .then((refreshToken) => refreshToken.toString());

    return { refreshToken };
  }

  async postProfile(body) {
    const refreshToken: string = body.refreshToken.toString();

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

    const idToken = await this.httpService
      .post(apiURL, params, config)
      .toPromise()
      .then((res) => res.data)
      .then((data) => data.id_token);

    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.log(error.message);
      return { error: error.message };
    }
  }

  async postLogout(body) {
    const uid: string = body.uid.toString();

    return this.auth.revokeRefreshTokens(uid).then((userRecord) => {
      console.log('Successfully revoked tokens for user:', userRecord);
      return { status: 'ok' };
    });
  }
}
