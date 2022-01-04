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

  async initializeTransaction() {
    let createdTransaction: any;

    try {
      createdTransaction = await this.paystack.initializeTransaction({
        reference: generateId(20),
        amount: 500000,
        email: 'rjemekoba@gmail.com',
      });

      console.log(createdTransaction.body);
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

  async verifyTransaction(reference: string) {
    let verifiedTransaction: any;

    try {
      verifiedTransaction = await this.paystack.verifyTransaction({
        reference: reference,
      });

      console.log(verifiedTransaction.body);
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
