import {
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
import { BCRYPT_SALT } from 'src/constants';
import { AdminTypes } from 'src/enums';
import { Admin } from 'src/models/admin.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  reviseUserPayload(admin): Admin {
    delete admin.id;
    delete admin.password;
    delete admin.confirm_password;
    delete admin.token;

    return admin;
  }

  async createAdmin(createAdminPayload: any) {
    let { password, email } = createAdminPayload;

    let adminExists: Admin;

    try {
      adminExists = await this.adminModel.findOne({ email });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (adminExists) {
      throw new NotAcceptableException(
        null,
        'an admin with this email is already registered....try changing your email to continue',
      );
    }

    try {
      password = await bcrypt.hash(password, BCRYPT_SALT);

      let newAdmin = {
        ...createAdminPayload,
        password,
        token: 'unassigned',
        type: AdminTypes.NORMAL,
      };

      new this.adminModel(newAdmin).save();

      newAdmin = this.reviseUserPayload(newAdmin);

      return newAdmin;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async getAllCustomers(admin_id: string) {
    let foundAdmin: Admin;

    try {
      foundAdmin = await this.adminModel.findOne({
        _id: admin_id,
        type: AdminTypes.SUPER_ADMIN,
      });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!foundAdmin) {
      Logger.error('invaid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invaid credentials. could not find matching super admin',
      );
    }

    try {
      const allCustomers: User[] = await this.userModel.find({});

      return allCustomers;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }
  }

  async blockCustomer(adminId: string, customerId: string) {
    let foundAdmin: Admin;

    try {
      foundAdmin = await this.adminModel.findOne({
        _id: adminId,
      });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(
        null,
        'error checking db for admin',
      );
    }

    if (!foundAdmin) {
      Logger.error('invaid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invaid credentials. could not find matching super admin',
      );
    }

    try {
      let deletedCustomer: User = await this.userModel.findOneAndUpdate(
        {
          _id: customerId,
        },
        { blocked: true },
        {
          new: true,
        },
      );

      return deletedCustomer;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error blocking customer');
    }
  }
}
