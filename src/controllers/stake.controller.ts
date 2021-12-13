import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { createStakeDto, updateStakeDto } from 'src/dto/stake.dto';
import { AuthService } from 'src/services/auth.service';
import { StakeService } from 'src/services/stake.service';
import { validator } from 'src/utils/validator';

@Controller('stake')
export class StakeController {
  constructor(
    private readonly authService: AuthService,
    private readonly stakeService: StakeService,
  ) {}

  @Post('create')
  async createStakeController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: createStakeDto,
  ) {
    const {
      name,
      creator,
      supervisors,
      amount,
      description,
      currency,
      parties,
      dueDate,
    } = req.body;

    const hasError = validator([
      {
        name: 'name',
        value: name,
        options: { required: true, isString: true },
      },
      {
        name: 'creator',
        value: creator,
        options: { required: true, isString: true },
      },
      {
        name: 'parties',
        value: parties,
        options: { required: true, isArray: true },
      },
      {
        name: 'supervisors',
        value: supervisors,
        options: { required: true, isArray: true },
      },
      {
        name: 'amount',
        value: amount,
        options: { required: true, isString: true },
      },
      {
        name: 'currency',
        value: currency,
        options: { required: true, isString: true },
      },
      description
        ? {
            name: 'description',
            value: description,
            options: { isString: true },
          }
        : null,
      {
        name: 'name',
        value: name,
        options: {
          required: true,
          isString: true,
        },
      },
      {
        name: 'Due Date',
        value: dueDate,
        options: {
          required: true,
        },
      },
    ]);

    if (supervisors.length < 1) {
      resp.json({
        status: 'failed',
        description: 'must have at least one supervisor to create a stake',
        code: 406,
      });
    }

    if (parties.length < 1) {
      resp.json({
        status: 'failed',
        description: 'must have at least one other party to create a stake',
        code: 406,
      });
    }

    if (!hasError) {
      const stake = await this.stakeService.createStake(body);

      resp.json({
        stake,
        status: 'success',
        description: 'operation successful',
        code: 200,
      });
    } else {
      resp.json({
        status: 'failed',
        description: 'operation successful',
        code: 406,
      });

      throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }

  @Put('update')
  async updateStakeController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: updateStakeDto,
  ) {
    const { id, name, amount, description, currency, dueDate } = body;

    const hasError = validator([
      {
        name: 'stake id',
        value: id,
        options: { required: true, isString: true },
      },
      {
        name: 'name',
        value: name,
        options: { required: true, isString: true },
      },
      {
        name: 'amount',
        value: amount,
        options: { required: true, isString: true },
      },
      {
        name: 'currency',
        value: currency,
        options: { required: true, isString: true },
      },
      description
        ? {
            name: 'description',
            value: description,
            options: { isString: true },
          }
        : null,
      {
        name: 'name',
        value: name,
        options: {
          required: true,
          isString: true,
        },
      },
      {
        name: 'Due Date',
        value: dueDate,
        options: {
          required: true,
        },
      },
    ]);

    if (!hasError) {
      const stake = await this.stakeService.updateStake(body);

      resp.json({
        stake,
        status: 'success',
        description: 'operation successful',
        code: 200,
      });
    } else {
      resp.json({
        status: 'failed',
        description: 'operation successful',
        code: 406,
      });

      throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }
}
