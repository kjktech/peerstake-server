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
    let allCustomers;

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

    allCustomers = allCustomers.filter(
      (e: User) => e.wallet['_id'].toString() === wallet_id,
    );

    let wallet = {
      data: allCustomers[0].wallet,
      owner_id: allCustomers[0]._id,
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

  async balance(wallet_id: string) {
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
