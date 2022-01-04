import {
  HttpException,
  HttpStatus,
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
import { Paystack_User_Reference, User } from 'src/models/user.model';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import messenger from 'src/utils/messenger';
import { PaystackService } from './paystack.service';
import { WalletService } from './wallet.service';
import { Wallet } from 'src/models/wallet.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly paystackService: PaystackService,
    private readonly walletService: WalletService,
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
    let { first_name, last_name, password, email, username, phone_number } =
      signUpPayload;

    let emailExists: User;
    let usernameExists: User;
    let phoneNumberExists: User;
    let paystack_user_ref: Paystack_User_Reference;
    let wallet_ref: any;

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
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error:
            'this email is already taken....try changing your email to continue',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (usernameExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error:
            'this username is already taken....try changing your username to continue',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (phoneNumberExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error:
            'phone number is already taken....try changing your username to continue',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    try {
      paystack_user_ref = await this.paystackService.createCustomer(
        email,
        first_name,
        last_name,
        phone_number.toString(),
      );
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      wallet_ref = await this.walletService.createWallet(
        '0065180934',
        '063',
        'NGN',
      );
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      password = await bcrypt.hash(password, BCRYPT_SALT);

      let newUser: any = {
        ...signUpPayload,
        first_name,
        last_name,
        phone_number,
        password,
        token: 'unassigned',
        wallet: {
          ...wallet_ref,
        },
        paystack_ref: {
          ...paystack_user_ref,
        },
      };

      newUser = new this.userModel(newUser).save();

      newUser = this.reviseUserPayload(newUser);

      return newUser;
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  googleLogin(req) {
    if (!req.user) {
      return 'no user from google';
    } else {
      return {
        message: 'User Info from Google',
        user: req.user,
      };
    }
  }

  async initResetPassword(email: string) {
    let foundUser: User;

    //todo: add token to url string that will be used to verify against user
    //todo: create pass_reset_code field for user that holds token to verify against

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

    messenger(email, 'reset password', {
      text: `Click the link below to reset password`,
    });
  }

  async completeResetPassword(user_id: string, password: string) {}

  async verifyUser(user_id: string) {
    let foundUser: User;

    try {
      foundUser = await this.userModel.findOne({ _id: user_id });
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
