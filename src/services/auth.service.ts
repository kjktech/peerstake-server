import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { jwt_expire_time, BCRYPT_SALT } from 'src/constants';
import { IToken } from 'src/enums';
import { User } from 'src/models/user.model';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import messenger from 'src/utils/messenger';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  reviseUserPayload(user): User {
    delete user.id;
    delete user.password;
    delete user.confirm_password;
    delete user.token;

    return user;
  }

  async detokenize(req, resp, options?: { noTimeout: boolean }) {
    const { authorization } = req.headers;

    console.log('breeze------------', req.body);

    if (!authorization) {
      throw new UnauthorizedException(
        'Unauthorized request',
        'This is an unauthorized request',
      );
    }

    const token = (authorization as string).match(/(?<=([b|B]earer )).*/g)?.[0];

    const unTokenized: IToken = this.jwtService.decode(token) as IToken;

    let user: User;

    try {
      user = await this.userModel.findOne({
        _id: unTokenized.userId.toString(),
      });
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        throw new UnauthorizedException(
          'Unauthorized request',
          'This is an unauthorized request',
        );
      } else {
        throw new InternalServerErrorException('Internal server error', e);
      }
    }

    if (!options?.noTimeout) {
      if (
        user.token &&
        new Date().getTime() - unTokenized.time <= jwt_expire_time * 1000
      ) {
        user.token = this.jwtService.sign({
          userId: user['_id'],
          date: new Date().getTime(),
        });

        user.save();
      } else {
        throw new UnauthorizedException(null, 'Session timeout');
      }
    }

    req.requesterId = user['_id'];
  }

  async signUp(signUpPayload: SignUpDto) {
    let { password, email, username, phone_number } = signUpPayload;

    let emailExists: User;
    let usernameExists: User;
    let phoneNumberExists: User;

    try {
      emailExists = await this.userModel.findOne({ email });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    try {
      phoneNumberExists = await this.userModel.findOne({ phone_number });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    try {
      usernameExists = await this.userModel.findOne({ username });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (emailExists) {
      throw new NotAcceptableException(
        null,
        'this email is already taken....try changing your email to continue',
      );
    }

    if (usernameExists) {
      throw new NotAcceptableException(
        null,
        'this username is already taken....try changing your username to continue',
      );
    }

    if (phoneNumberExists) {
      throw new NotAcceptableException(
        null,
        'phone number is already taken....try changing your username to continue',
      );
    }

    try {
      password = await bcrypt.hash(password, BCRYPT_SALT);

      let newUser = {
        ...signUpPayload,
        password,
        token: 'unassigned',
        wallet: {
          transactions: [],
          balance: 0,
          currency: 'NAIRA',
        },
      };

      new this.userModel(newUser).save();

      newUser = this.reviseUserPayload(newUser);

      return newUser;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async signIn(signInPayload: SignInDto): Promise<User> {
    const { email, password } = signInPayload;

    let foundUser: User;

    try {
      foundUser = await this.userModel.findOne({ email });
    } catch (e) {
      Logger.error(e);

      throw new NotFoundException(
        null,
        'incorrect credentials. Check your email and password and try again',
      );
    }

    if (!foundUser) {
      throw new NotAcceptableException(null, 'user does not exist');
    }

    if (!(await bcrypt.compare(password, foundUser.password))) {
      throw new InternalServerErrorException(null, 'incorrect password');
    }

    let token = await this.jwtService.signAsync({
      userId: foundUser.id,
      time: new Date().getTime(),
    });

    try {
      foundUser.token = token.toString();

      foundUser.save();

      messenger(foundUser.email, 'You logged in', {
        text: 'A login has been identified on your account if this was not you, click here to reset password',
      });

      delete foundUser.password;

      return foundUser;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'login failed');
    }
  }
}
