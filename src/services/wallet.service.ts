import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { TransactionTypes } from 'src/enums';
import { Wallet } from 'src/models/wallet.model';
import { PaystackService } from './paystack.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly paystackService: PaystackService,
  ) {}

  async createWallet(
    account_number: string,
    bank_code: string,
    currency: string,
  ) {
    //* create customer,
    //* resolve account number with bank code,
    try {
      let responseAcctNum = await this.paystackService.verifyAccountNumber(
        account_number,
        bank_code,
      );
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }

    return { transactions: [], balance: 0, currency: 'NAIRA' };
  }

  async getTransactions(wallet_id: string) {
    try {
      const wallet: { data: Wallet; owner: User } = await this.findWallet(
        wallet_id,
      );

      return wallet.data.transactions;
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'could not return wallet transactions ' + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

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
      owner: foundCustomer[0],
    };

    return wallet;
  }

  async deposit(wallet_id: string, amount: string) {
    const wallet: { data: Wallet; owner: any } = await this.findWallet(
      wallet_id,
    );

    try {
      wallet.data.transactions.push({
        amount,
        type: TransactionTypes.DEPOSIT,
      });

      wallet.data.balance = wallet.data.balance + parseInt(amount);

      const resp: User = await wallet.owner.save();

      return resp.wallet;
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

  async withdrawal(wallet_id: string, amount: string) {
    const wallet: { data: Wallet; owner: any } = await this.findWallet(
      wallet_id,
    );

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
      wallet.data.transactions.push({
        amount,
        type: TransactionTypes.WITHDRAWAL,
      });

      wallet.data.balance = wallet.data.balance - parseInt(amount);

      const resp: User = await wallet.owner.save();

      return resp.wallet;
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
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'could not return wallet balance',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async getAllBanks() {
    try {
      const body = await this.paystackService.getAllBanks();

      return body;
    } catch (e) {
      Logger.error(e);
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'could not get banks',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }
}
