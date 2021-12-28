import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';

@Injectable()
export class WalletService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getTransactions(walletId: string) {}
}
