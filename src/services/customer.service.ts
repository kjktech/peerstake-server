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

  async updateCustomer(customerUpdatePayload) {
    const { id } = customerUpdatePayload;

    const foundCustomer = await this.userModel.findOne({ _id: id });

    if (!foundCustomer) {
      throw new InternalServerErrorException(null, 'could not find customer');
    }

    // console.log(foundCustomer);

    try {
      const filter = { _id: id };

      const update = {
        ...customerUpdatePayload,
      };

      const updatedCustomer = await this.userModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        },
      );

      return updatedCustomer;
    } catch {
      throw new NotFoundException(null, 'could not find customer');
    }
  }

  async getCustomer(id: string, email: string, username: string) {
    const validQuery = id ?? email ?? username;
    const validQueryType = id
      ? 'id'
      : email
      ? 'email'
      : username
      ? 'username'
      : 'undefined';

    // console.log('valid query', validQuery);
    // console.log('valid query type', validQueryType);

    try {
      const customer = await this.userModel.findOne({
        [`${validQueryType === 'id' ? '_id' : validQueryType}`]: validQuery,
      });

      return customer;
    } catch (e) {
      throw new NotFoundException(null, 'could not find customer');
    }
  }
}
