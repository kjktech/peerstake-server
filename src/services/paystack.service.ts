import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { generateId } from 'src/utils/helpers';
const PayStack = require('paystack-node');

config();

const { PAYSTACK_TEST_KEY, NODE_ENV } = process.env;

@Injectable()
export class PaystackService {
  paystack: typeof PayStack;

  constructor() {
    this.paystack = new PayStack(PAYSTACK_TEST_KEY, NODE_ENV);
  }

  async verifyBankDetails(bank_code: string) {}

  getFeesFor(amount: string): string {
    const feesCalculator = new PayStack.Fees();
    return feesCalculator.calculateFor(parseInt(amount)).toString();
  }

  async getAllBanks() {
    try {
      const { body } = await this.paystack.listBanks({
        currency: 'NGN',
      });

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

  async createCustomer(
    email: string,
    first_name: string,
    last_name: string,
    phone: string,
  ) {
    let createdCustomer: any;

    try {
      createdCustomer = await this.paystack.createCustomer({
        email,
        first_name,
        last_name,
        phone,
      });

      console.log(createdCustomer.body);

      const { id, customer_code } = createdCustomer.body.data;

      return {
        id,
        customer_code,
      };
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'could not create customer' + '-----------------' + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async initializeTransaction(email: string, amount: string) {
    let createdTransaction: any;

    try {
      createdTransaction = await this.paystack.initializeTransaction({
        amount: parseInt(amount) * 100,
        email: email,
      });

      const { access_code, reference } = createdTransaction.body.data;

      return {
        access_code,
        reference,
        fee: this.getFeesFor(amount),
      };
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'Error implementing paystack api' + '-----------------' + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async makePayment(
    card: {
      number: string;
      cvv: string;
      expiry_year: string;
      expiry_month: string;
    },
    email: string,
    amount: string,
  ) {
    try {
      const { body } = this.paystack.chargeCard({
        card: {
          number: '4084084084084081',
          cvv: '408',
          expiry_year: '2024',
          expiry_month: '08',
        },
        email: 'me.biodunch@xyz.ng',
        amount: '15600000',
      });

      console.log(body);
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
  }

  async verifyTransaction(reference: string) {
    let verifiedTransaction: any;

    try {
      verifiedTransaction = await this.paystack.verifyTransaction({
        reference: reference,
      });

      console.log(verifiedTransaction.body);

      return verifiedTransaction.body;
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'Error implementing paystack api' + '-----------------' + e,
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async verifyAccountNumber(account_number: string, bank_code: string) {
    try {
      let responseAcctNum = await this.paystack.resolveAccountNumber({
        account_number,
        bank_code,
      });

      console.log(responseAcctNum);
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
  }
}
