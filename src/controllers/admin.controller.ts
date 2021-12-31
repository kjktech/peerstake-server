import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AdminService } from 'src/services/admin.service';
import { validator } from 'src/utils/validator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdminController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body,
  ) {
    const {
      super_admin_id,
      username,
      password,
      confirm_password,
      first_name,
      last_name,
      email,
    } = body;

    const hasError = validator([
      {
        name: 'super admin id',
        value: super_admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'password',
        value: password,
        options: {
          required: true,
          isString: true,
          lengthGreatherThan: 8,
          lengthLesserThan: 20,
          isPassword: true,
        },
      },
      {
        name: 'username',
        value: username,
        options: { required: true, isString: true },
      },
      {
        name: 'confirm password',
        value: confirm_password,
        options: { required: true, isString: true, equalTo: password },
      },
      {
        name: 'firstname',
        value: first_name,
        options: { required: true, isString: true },
      },
      {
        name: 'lastname',
        value: last_name,
        options: { required: true, isString: true },
      },
      {
        name: 'email',
        value: email,
        options: { required: true, isString: true, isEmail: true },
      },
    ]);

    if (!hasError) {
      const admin = await this.adminService.createAdmin(body);

      resp.json({
        admin,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Put('update')
  // @UseMiddleware('userGuard')
  async updateAdminController(@Res() resp, @Body() body) {
    const {
      super_admin_id,
      admin_id,
      username,
      first_name,
      last_name,
      email,
      address,
    } = body;

    const hasError = validator([
      {
        name: 'super admin id',
        value: super_admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
      username
        ? {
            name: 'username',
            value: username,
            options: { isString: true },
          }
        : null,
      address
        ? {
            name: 'address',
            value: address,
            options: { isString: true },
          }
        : null,
      first_name
        ? {
            name: 'firstname',
            value: first_name,
            options: { isString: true },
          }
        : null,
      last_name
        ? {
            name: 'lastname',
            value: last_name,
            options: { isString: true },
          }
        : null,
      email
        ? {
            name: 'email',
            value: email,
            options: { isString: true, isEmail: true },
          }
        : null,
    ]);

    if (!hasError) {
      const updatedAdmin = await this.adminService.updateAdmin(body);

      resp.json({ updatedAdmin, descrption: 'operaton sucessful', code: 0 });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Patch('suspend')
  async suspendAdminController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { super_admin_id, admin_id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: super_admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const suspendedAdmin = await this.adminService.suspendAdmin(
        super_admin_id,
        admin_id,
      );

      resp.json({
        suspendedAdmin,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Delete('delete')
  async blockAdminController(@Query() query, @Res({ passthrough: true }) resp) {
    const { super_admin_id, admin_id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: super_admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const deletedCustomer = await this.adminService.deleteAdmin(
        super_admin_id,
        admin_id,
      );

      if (deletedCustomer.success) {
        resp.json({
          message: 'operation successful',
          code: 200,
        });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_IMPLEMENTED,
            error: 'could not delete admin',
          },
          HttpStatus.NOT_IMPLEMENTED,
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Get('get-all-stakes')
  async getAllStakesController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const allStakes = await this.adminService.getAllStakes(id);

      resp.json({
        allStakes,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Get('get-all-customers')
  async getAllCustomersController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { admin_id } = query;

    const hasError = validator([
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const allCustomers = await this.adminService.getAllCustomers(admin_id);

      resp.json({
        allCustomers,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Get('all-disputes')
  async getAllStakeDisputesController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { admin_id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const disputes = await this.adminService.getAllDisputes(admin_id);

      resp.json({
        disputes,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Post('resolve-dispute')
  async resolveDisputeAdminController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body,
  ) {
    const { admin_id, dispute_id, resolution } = body;

    const hasError = validator([
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'dispute id',
        value: dispute_id,
        options: { required: true, isString: true },
      },
      {
        name: 'resolution',
        value: resolution,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const resolved = await this.adminService.resolveDispute(
        admin_id,
        dispute_id,
        resolution,
      );

      resp.json({
        resolved,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Get('get-customer-transaction-history')
  async getTransactionHistoryController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { admin_id, customer_id } = query;

    const hasError = validator([
      {
        name: 'admin id',
        value: admin_id,
        options: { required: true, isString: true },
      },
      {
        name: 'customer id',
        value: customer_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const transactions =
        await this.adminService.getCustomerTransactionHistory(
          admin_id,
          customer_id,
        );

      resp.json({
        transactions,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Put('block-customer')
  async blockCustomerController(@Req() req, @Res({ passthrough: true }) resp) {
    const { adminId, customerId } = req.body;

    const hasError = validator([
      {
        name: 'admin id',
        value: adminId,
        options: { required: true, isString: true },
      },
      {
        name: 'customer id',
        value: customerId,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const blockedCustomer = await this.adminService.blockCustomer(
        adminId,
        customerId,
      );

      resp.json({
        blockedCustomer,
        message: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
