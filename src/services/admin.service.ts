import {
  HttpException,
  HttpStatus,
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
import { AdminTypes, DisputeStatus } from 'src/enums';
import { Admin } from 'src/models/admin.model';
import { Stake, Stake_Dispute } from 'src/models/stake.model';
import { User } from 'src/models/user.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
    private readonly jwtService: JwtService,
  ) {}

  reviseAdminPayload(admin: Admin) {
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
        isSuspended: false,
      };

      newAdmin = new this.adminModel(newAdmin).save();

      newAdmin = this.reviseAdminPayload(newAdmin);

      return newAdmin;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  private async verifyAdminStatus(
    admin_id: string,
    options?: { super: boolean },
  ) {
    let foundAdmin: Admin;
    const isSuperAdmin = options && options.super === true ? true : false;

    try {
      foundAdmin = await this.adminModel.findOne(
        isSuperAdmin
          ? {
              _id: admin_id,
              type: AdminTypes.SUPER_ADMIN,
            }
          : {
              _id: admin_id,
            },
      );
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!foundAdmin) {
      Logger.error(
        `invalid credentials. could not find matching ${
          isSuperAdmin ? 'super ' : ''
        }admin`,
      );

      throw new InternalServerErrorException(
        null,
        `invalid credentials. could not find matching ${
          isSuperAdmin ? 'super ' : ''
        }admin`,
      );
    }
  }

  async updateAdmin(adminUpdatePayload: any) {
    const { super_admin_id, admin_id } = adminUpdatePayload;

    await this.verifyAdminStatus(super_admin_id, { super: true });

    try {
      const filter = { _id: admin_id };

      const update = {
        ...adminUpdatePayload,
      };

      const updatedAdmin = await this.adminModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        },
      );

      return updatedAdmin;
    } catch {
      throw new NotFoundException(null, 'could not update admin');
    }
  }

  async suspendAdmin(super_admin_id: string, admin_id: string) {
    let foundAdmin: Admin;
    let foundSuperAdmin: Admin;

    try {
      foundSuperAdmin = await this.adminModel.findOne({
        _id: super_admin_id,
        type: AdminTypes.SUPER_ADMIN,
      });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!foundSuperAdmin) {
      Logger.error('invalid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invalid credentials. could not find matching super admin',
      );
    }

    try {
      foundAdmin = await this.adminModel.findOneAndUpdate(
        {
          _id: admin_id,
          type: AdminTypes.NORMAL,
        },
        {
          isSuspended: true,
        },
        {
          new: true,
        },
      );

      return foundAdmin;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }
  }

  async getAllStakes(admin_id: string) {
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
      Logger.error('invalid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invalid credentials. could not find matching super admin',
      );
    }

    try {
      const allStakes: Stake[] = await this.stakeModel.find({});

      return allStakes;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
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
      Logger.error('invalid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invalid credentials. could not find matching super admin',
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
      Logger.error('invalid credentials. could not find matching super admin');

      throw new InternalServerErrorException(
        null,
        'invalid credentials. could not find matching super admin',
      );
    }

    try {
      let blockedCustomer: User = await this.userModel.findOneAndUpdate(
        {
          _id: customerId,
        },
        { blocked: true },
        {
          new: true,
        },
      );

      return blockedCustomer;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error blocking customer');
    }
  }

  async deleteAdmin(super_admin_id: string, admin_id: string) {
    await this.verifyAdminStatus(super_admin_id, { super: true });

    try {
      this.adminModel.deleteOne(
        { _id: admin_id, type: AdminTypes.NORMAL },
        (err) => {
          if (err) {
            throw new HttpException(
              {
                status: HttpStatus.NOT_IMPLEMENTED,
                error: err,
              },
              HttpStatus.NOT_IMPLEMENTED,
            );
          }
        },
      );

      return { success: true };
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error blocking customer');
    }
  }

  async getCustomerTransactionHistory(admin_id: string, customer_id: string) {
    await this.verifyAdminStatus(admin_id);

    let foundCustomer: User;

    try {
      foundCustomer = await this.userModel.findOne({ _id: customer_id });

      return foundCustomer.wallet.transactions;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error blocking customer');
    }
  }

  async getAllDisputes(admin_id: string) {
    await this.verifyAdminStatus(admin_id);

    let foundStakes;
    let stakeDisputes: Stake_Dispute[] = [];

    try {
      foundStakes = await this.stakeModel.find({
        disputes: { $elemMatch: { status: DisputeStatus.OPEN } },
      });

      stakeDisputes = foundStakes.map((each_doc: Stake) => {
        let each_doc_dispute = [];

        each_doc.disputes.map((each_dispute: Stake_Dispute) => {
          if (each_dispute.status === DisputeStatus.OPEN) {
            each_doc_dispute.push(each_dispute);
          }
        });

        return each_doc_dispute;
      });

      stakeDisputes = [].concat(...stakeDisputes);

      return stakeDisputes;
    } catch (e) {
      Logger.error(e);

      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          error: 'Error getting disputes',
        },
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  async resolveDispute(
    admin_id: string,
    dispute_id: string,
    resolution: DisputeStatus,
  ): Promise<any> {
    await this.verifyAdminStatus(admin_id);

    let resolvedStake: Stake;

    try {
      resolvedStake = await this.stakeModel.findOneAndUpdate(
        {
          disputes: {
            $elemMatch: { _id: dispute_id, status: DisputeStatus.OPEN },
          },
        },
        { $set: { 'disputes.$.status': resolution } },
        { new: true },
      );
    } catch (e) {}

    return resolvedStake.disputes;
  }
}
