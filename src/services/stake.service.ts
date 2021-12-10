import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createStakeDto, updateStakeDto } from 'src/dto/stake.dto';
import { Stake } from 'src/models/stake.model';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
  ) {}

  async createStake(stake_payload: createStakeDto) {
    let { parties } = stake_payload;

    try {
      let newStake = {
        ...stake_payload,
      };

      newStake = new this.stakeModel(stake_payload).save();

      return newStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async updateStake(stake_payload: updateStakeDto) {
    let { id } = stake_payload;

    let stakeExists: Stake;

    try {
      stakeExists = await this.stakeModel.findOne({ _id: id });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!stakeExists) {
      throw new NotAcceptableException(
        null,
        'cannot find record of this stake',
      );
    }

    try {
      let updatedStake = {
        ...stake_payload,
      };

      new this.stakeModel(updatedStake).save();

      return updatedStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }
}
