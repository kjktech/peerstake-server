import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createStakeDto, updateStakeDto } from 'src/dto/stake.dto';
import { AuthService } from 'src/services/auth.service';
import { StakeService } from 'src/services/stake.service';
import { Middleware, UseMiddleware } from 'src/utils/middleware';
import { validator } from 'src/utils/validator';

@Controller('stake')
export class StakeController {
  constructor(
    private readonly authService: AuthService,
    private readonly stakeService: StakeService,
  ) {}

  @Middleware
  async userGuard(req, resp) {
    await this.authService.detokenize(req, resp, { noTimeout: true });
  }

  @Post('create')
  // @UseMiddleware('userGuard')
  @UseInterceptors(FileInterceptor('decider'))
  async createStakeController(
    @Req() req,
    @UploadedFile() file,
    @Res({ passthrough: true }) resp,
  ) {
    // console.log(file);

    // req.body = {
    //   ...req.body,
    //   decider: req.body.decider.constructor !== Array ? [file] : file,
    // };

    if (req.body.parties.constructor !== Array) {
      req.body = {
        ...req.body,
        parties: [req.body.parties + ''],
      };
    }

    let { parties }: createStakeDto = req.body;

    const {
      creator_id,
      name,
      amount,
      description,
      currency,
      due_date,
    }: createStakeDto = req.body;

    const hasError = validator([
      {
        name: 'name',
        value: name,
        options: { required: true, isString: true },
      },
      {
        name: 'creator id',
        value: creator_id,
        options: { required: true, isString: true },
      },
      {
        name: 'parties',
        value: parties,
        options: { required: true },
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
        value: due_date,
        options: {
          required: true,
        },
      },
    ]);

    // if (parseInt(amount) < 10) {
    //   resp.json({
    //     status: 'failed',
    //     description: "you can't stake below 10 naira.",
    //     code: 406,
    //   });
    // }

    if (parties.length < 1) {
      resp.json({
        status: 'failed',
        description: 'must have at least one other party to create a stake',
        code: 406,
      });
    }

    if (!hasError) {
      const stake = await this.stakeService.createStake(req.body);

      resp.json({
        stake,
        status: 'success',
        description: 'operation successful',
        code: 200,
      });
    } else {
      resp.json({
        status: 'failed',
        description: hasError?.[0].msg[0],
        code: 406,
      });

      // throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }

  @Put('edit')
  @UseInterceptors(FileInterceptor('decider'))
  async editStakeController(@Req() req, @Res({ passthrough: true }) resp) {
    const {
      stakeId,
      name,
      amount,
      description,
      currency,
      due_date,
    }: updateStakeDto = req.body;

    console.log(name);

    const hasError = validator([
      stakeId && {
        name: 'stake id',
        value: stakeId,
        options: { required: true, isString: true },
      },
      name && {
        name: 'name',
        value: name,
        options: { isString: true },
      },
      description && {
        name: 'amount',
        value: amount,
        options: { isString: true },
      },
      currency && {
        name: 'currency',
        value: currency,
        options: { isString: true },
      },
      description && {
        name: 'description',
        value: description,
        options: { isString: true },
      },
      due_date && {
        name: 'Due Date',
        value: due_date,
        options: { isString: true },
      },
    ]);

    if (!hasError) {
      const stake = await this.stakeService.updateStake(req.body);

      resp.json({
        stake,
        status: 'success',
        description: 'operation successful',
        code: 200,
      });
    } else {
      resp.json({
        status: 'failed',
        description: hasError?.[0].msg[0],
        code: 406,
      });
    }
  }

  @Post('claim')
  async claimStakeController(@Req() req, @Res({ passthrough: true }) resp) {
    const { creator_id, stakeId } = req.body;

    const hasError = validator([
      {
        name: 'creator id',
        value: creator_id,
        options: { required: true, isString: true },
      },
      {
        name: 'stake id',
        value: stakeId,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const stake = await this.stakeService.preClaimStake(req.body);

      resp.json({
        stake,
        status: 'success',
        description: 'operation successful. all parties notified',
        code: 200,
      });
    } else {
      resp.json({
        status: 'failed',
        description: hasError?.[0].msg[0],
        code: 406,
      });

      // throw new NotFoundException(null, hasError?.[0].msg[0]);
    }
  }

  @Post('verify')
  async verifyStakeController(@Req() req, @Res({ passthrough: true }) resp) {
    const { partyId, stakeId } = req.body;

    const hasError = validator([
      {
        name: 'party id',
        value: partyId,
        options: { required: true, isString: true },
      },
      {
        name: 'stake id',
        value: stakeId,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const stake = await this.stakeService.verifyStake(req.body);

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

  @Get('get')
  async getCustomerController(@Query() query, @Res() resp) {
    let { creator_id, stake_id, all } = query;

    const errorMsgs = validator([
      creator_id && {
        name: 'creator id',
        value: creator_id,
        options: { required: true, isString: true },
      },

      !all && {
        name: 'stake id',
        value: stake_id,
        options: { required: true, isString: true },
      },
    ]);

    if (errorMsgs) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: errorMsgs?.[0].msg?.[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const stakes = await this.stakeService.getStakes(creator_id, stake_id, all);

    resp.json({
      code: 0,
      description: 'operation successful',
      [`stake${all ? 's' : ''}`]: stakes,
    });
  }

  @Get('accept')
  async acceptCustomerController(@Query() query, @Res() resp) {
    let { party_id, stake_id } = query;

    const errorMsgs = validator([
      party_id && {
        name: 'party id',
        value: party_id,
        options: { required: true, isString: true },
      },
    ]);

    if (errorMsgs) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: errorMsgs?.[0].msg?.[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const acceptance = await this.stakeService.acceptStakeInvite(
      party_id,
      stake_id,
    );

    resp.json({
      code: 0,
      description: 'operation successful',
      acceptance,
    });
  }

  @Post('dispute')
  async disputeStakeController(@Req() req, @Res({ passthrough: true }) resp) {
    const { disputer_id, stake_id, details } = req.body;

    const hasError = validator([
      {
        name: 'disputer id',
        value: disputer_id,
        options: { required: true, isString: true },
      },
      {
        name: 'stake id',
        value: stake_id,
        options: { required: true, isString: true },
      },
      {
        name: 'details',
        value: details,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const stakeDispute = await this.stakeService.disputeStake(
        stake_id,
        disputer_id,
        details,
      );

      resp.json({
        stakeDispute,
        status: 'success',
        description: 'operation successful',
        code: 200,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: hasError?.[0].msg?.[0],
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
