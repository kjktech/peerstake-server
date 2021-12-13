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
import { User, User_Reference } from 'src/models/user.model';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
  ) {}

  async verifyParties(partiesIds: string[]): Promise<User[]> {
    Promise.all(
      //   [
      //   this.userModel.find({ _id: '61b06db6a6ebc700226a9e4f' }),
      //   this.userModel.find({ _id: '61b085a02b6b9f4084bad0fa' }),
      // ]

      partiesIds.map((_id) => this.userModel.find({ _id })),
    )
      .then(([user, member]) => {
        console.log('user', user);
      })
      .catch((err) => {
        console.log(err);
      });

    return;
  }

  async createStake(stake_payload: createStakeDto) {
    let { parties } = stake_payload;

    // const userReferences: User_Reference[] = await this.verifyParties(parties);

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
