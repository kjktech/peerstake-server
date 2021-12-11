import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
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
      // {
      //   name: 'super admin id',
      //   value: super_admin_id,
      //   options: { required: true, isString: true },
      // },
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

      return {
        admin,
        message: 'operation successful',
      };
    } else {
      throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }
}
