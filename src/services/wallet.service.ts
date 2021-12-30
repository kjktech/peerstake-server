import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { InjectPaystack } from 'nestjs-paystack';
import * as paystack from 'paystack';
import { TransactionTypes } from 'src/enums';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectPaystack() private readonly paystackClient: paystack,
  ) {}

  async getTransactions(wallet_id: string) {}

  async verifyWallet(wallet_id: string) {}

  async deposit(wallet_id: string, amount: string) {
    let foundCustomer: User;

    try {
      foundCustomer = await this.userModel.findOne({
        _id: wallet_id,
      });
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

    try {
      const filter = { $match: { 'wallet._id': wallet_id } };

      const update = {
        'wallet.balance': foundCustomer.wallet.balance + parseInt(amount),
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
    // this.paystackClient.listTrx().then((res) => {
    //   console.log(res);
    // });
    // if (foundCustomer.wallet.balance < parseInt(amount)) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.NOT_ACCEPTABLE,
    //       error: 'you do not have sufficent balance to perform this operation',
    //     },
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }
  }
}
