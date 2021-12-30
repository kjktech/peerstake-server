import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { InjectPaystack } from 'nestjs-paystack';
import * as paystack from 'paystack';
import { TransactionTypes } from 'src/enums';
import { Wallet } from 'src/models/wallet.model';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectPaystack() private readonly paystackClient: paystack,
  ) {}

  async getTransactions(wallet_id: string) {}

  async verifyWallet(wallet_id: string) {}

  async findWallet(wallet_id: string) {
    let allCustomers: User[];
    let foundCustomer: any;

    try {
      allCustomers = await this.userModel.find({});
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'could not find wallet' + '----------' + e,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    foundCustomer = allCustomers.filter(
      (e: User) => e.wallet['_id'].toString() === wallet_id,
    );

    if (foundCustomer.length < 1) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'cound not find wallet with matching credentials',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let wallet = {
      data: foundCustomer[0].wallet,
      owner_id: foundCustomer[0]._id,
    };

    return wallet;
  }

  async deposit(wallet_id: string, amount: string) {
    const wallet = await this.findWallet(wallet_id);

    try {
      const filter = { _id: wallet.owner_id };
      const update = {
        'wallet.balance': wallet.data.balance + parseInt(amount),
        $push: {
          transactions: {
            amount,
            type: TransactionTypes.DEPOSIT,
          },
        },
      };
      const updatedCustomer = await this.userModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        },
      );
      return updatedCustomer.wallet;
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Error depositing funds',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async withdrawal(wallet_id: string, amount: string) {
    const wallet = await this.findWallet(wallet_id);

    if (wallet.data.balance < parseInt(amount)) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'insufficient funds',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    try {
      const filter = { _id: wallet.owner_id };
      const update = {
        'wallet.balance': wallet.data.balance - parseInt(amount),
        $push: {
          transactions: {
            amount,
            type: TransactionTypes.DEPOSIT,
          },
        },
      };
      const updatedCustomer = await this.userModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        },
      );
      return updatedCustomer.wallet;
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'Error depositing funds',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async balance(wallet_id: string) {
    try {
      const wallet = await this.findWallet(wallet_id);

      return wallet.data.balance;
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'could not return wallet balance',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
