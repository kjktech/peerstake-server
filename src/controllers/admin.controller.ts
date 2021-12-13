import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
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
      resp.json({
        message: hasError?.[0].msg[0],
        code: 406,
      });

      throw new NotAcceptableException(null, hasError?.[0].msg[0]);
    }
  }

  @Get('get-all-customers')
  async getAllCustomersController(
    @Query() query,
    @Res({ passthrough: true }) resp,
  ) {
    const { super_admin_id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: super_admin_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const allCustomers = await this.adminService.getAllCustomers(
        super_admin_id,
      );

      resp.json({
        allCustomers,
        message: 'operation successful',
        code: 200,
      });
    } else {
      resp.json({
        message: hasError?.[0].msg[0],
        code: 406,
      });

      throw new NotFoundException(null, hasError?.[0].msg[0]);
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
      resp.json({
        message: hasError?.[0].msg[0],
        code: 406,
      });

      throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }
}
