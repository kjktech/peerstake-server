import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

config();

const { PASSPORT_CLIENT_ID, PASSPORT_CLIENT_SECRET } = process.env;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: PASSPORT_CLIENT_ID,
      clientSecret: PASSPORT_CLIENT_SECRET,
      callBackURL:
        'https://peerstake-server.herokuapp.com/auth/google/callback',
      scope: '',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
