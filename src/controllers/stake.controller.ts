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
import { createStakeDto } from 'src/dto/stake.dto';
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
    const { name, creator, supervisor, amount, description } = body;

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
        name: 'supervisor',
        value: supervisor,
        options: { required: true, isString: true },
      },
      {
        name: 'amount',
        value: amount,
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
    ]);

    if (!hasError) {
      const stake = await this.stakeService.createStake(body);

      return {
        stake,
        message: 'operation successful',
      };
    } else {
      throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }
}
