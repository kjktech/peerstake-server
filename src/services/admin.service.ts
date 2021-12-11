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

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async createAdmin(createAdminPayload) {
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
        type: AdminTypes.SUPER_ADMIN,
      };

      new this.adminModel(newAdmin).save();

      // newAdmin = this.reviseUserPayload(newAdmin);

      return newAdmin;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }
}
