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
export class CustomerService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getCustomerBalance(customerId: string) {
    let found_customer;

    try {
      found_customer = await this.userModel.findOne({
        _id: customerId,
      });
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(null, 'customer does not exist');
    }

    console.log(found_customer);

    // try {
    //   let balance;

    //   const customer = await this.userModel.find({});

    //   customer.map((e) => {
    //     // reformat.push({
    //     //   user: e.user,
    //     // });
    //   });

    //   return balance;
    // } catch (e) {
    //   Logger.error(e);

    //   new InternalServerErrorException(null, 'could not get all users');
    // }
  }

  async updateCustomer(cutomerUpdatePayload) {}

  async getCustomer(customerId: string) {
    try {
      const customer = await this.userModel.findOne({
        _id: customerId,
      });

      console.log(customer);

      return customer;
    } catch (e) {
      throw new NotFoundException(null, 'could not find customer');
    }
  }
}
