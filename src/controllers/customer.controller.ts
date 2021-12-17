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
import { UpdateCustomerDto } from 'src/dto/customer.dto';
import { CustomerService } from 'src/services/customer.service';
import { validator } from 'src/utils/validator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('get-by')
  async getCustomerController(@Query() query, @Res() resp) {
    let { id, username, email } = query;

    const errorMsgs = validator([
      id && {
        name: 'customer id',
        value: id,
        options: { isString: true },
      },

      username && {
        name: 'customer username',
        value: username,
        options: { isString: true },
      },

      email && {
        name: 'customer email',
        value: email,
        options: { isString: true },
      },
    ]);

    if (errorMsgs) {
      resp.json({
        status: 'failed',
        code: 406,
        description: errorMsgs?.[0].msg?.[0],
      });

      throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
    }

    if (!username && !email && !id) {
      resp.json({
        status: 'failed',
        code: 406,
        description: 'at least one query must be provided to fetch customer',
      });

      throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
    }

    const customer = await this.customerService.getCustomer(
      id,
      email,
      username,
    );

    resp.json({
      code: 0,
      description: 'operation successful',
      customer,
    });
  }

  @Put('update')
  // @UseMiddleware('userGuard')
  async updateCustomer(@Res() resp, @Body() body) {
    const { id, username, first_name, last_name, address, email } = body;

    const hasError = validator([
      {
        name: 'customer id',
        value: id,
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
      const user = await this.customerService.updateCustomer(body);

      resp.json({ user, descrption: 'operaton sucessful', code: 0 });
    } else {
      throw new NotAcceptableException('', hasError?.[0].msg[0]);
    }
  }

  @Get('cutomer/:id/balance')
  async getBalanceController(@Req() req, @Res() resp) {
    let { customerId } = req.query;

    const errorMsgs = validator([
      {
        name: 'customer id',
        value: +customerId,
        options: { required: true, isNumber: true },
      },
    ]);

    if (errorMsgs) {
      resp.json({
        status: 'failed',
        code: 0,
        description: errorMsgs?.[0].msg?.[0],
      });

      throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
    }

    const balance = await this.customerService.getCustomerBalance(customerId);

    resp.json({
      status: 'success',
      code: 0,
      description: 'operation successful',
      balance,
    });
  }
}
