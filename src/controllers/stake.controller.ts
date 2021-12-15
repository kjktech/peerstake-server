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
    req.body = {
      ...req.body,
      decider: req.body.file.constructor !== Array ? [file] : file,
    };

    if (req.body.supervisors.constructor !== Array) {
      req.body = {
        ...req.body,
        supervisors: [req.body.supervisors + ''],
      };
    }

    if (req.body.parties.constructor !== Array) {
      req.body = {
        ...req.body,
        parties: [req.body.parties + ''],
      };
    }

    let { supervisors, parties }: createStakeDto = req.body;

    const {
      creatorId,
      name,
      amount,
      description,
      currency,
      dueDate,
    }: createStakeDto = req.body;

    const hasError = validator([
      {
        name: 'name',
        value: name,
        options: { required: true, isString: true },
      },
      {
        name: 'creator id',
        value: creatorId,
        options: { required: true, isString: true },
      },
      {
        name: 'parties',
        value: parties,
        options: { required: true },
      },
      {
        name: 'supervisors',
        value: supervisors,
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

    supervisors.map((supe: string) => {
      if (parties.includes(supe)) {
        throw new HttpException(
          {
            status: 'failed',
            code: HttpStatus.FORBIDDEN,
            error: 'A party to a stake cannot also be a supervisor',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    });

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
      dueDate,
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
      dueDate && {
        name: 'Due Date',
        value: dueDate,
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

  @Put('verify')
  async verifyStakeController(@Req() req, @Res({ passthrough: true }) resp) {
    const { id, name, amount, description, currency, dueDate } = req.body;

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
}
