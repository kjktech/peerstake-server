import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { WalletService } from 'src/services/wallet.service';
import { validator } from 'src/utils/validator';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly authService: AuthService,
    private readonly walletService: WalletService,
  ) {}

  @Get('transactions')
  async claimStakeController(@Query() query, @Res({ passthrough: true }) resp) {
    const { id } = query;

    const hasError = validator([
      {
        name: 'super admin id',
        value: id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const allStakes = await this.walletService.getTransactions(id);

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

  @Post('deposit')
  async depositController(@Res() resp, @Body() body) {
    const { wallet_id, amount } = body;

    const hasError = validator([
      {
        name: 'wallet id',
        value: wallet_id,
        options: { required: true, isString: true },
      },
      {
        name: 'amount',
        value: amount,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const updatedWallet = await this.walletService.deposit(wallet_id, amount);

      resp.json({
        updatedWallet,
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

  @Post('withdrawal')
  async withdrawController(@Res() resp, @Body() body) {
    const { wallet_id, amount } = body;

    const hasError = validator([
      {
        name: 'wallet id',
        value: wallet_id,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const allStakes = await this.walletService.withdrawal(wallet_id, amount);

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
}
