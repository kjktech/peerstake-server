import {
  HttpException,
  HttpStatus,
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
import { CurrencyTypes } from 'src/enums';
import { Party_Reference, Stake } from 'src/models/stake.model';
import { User, User_Reference } from 'src/models/user.model';

@Injectable()
export class StakeService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Stake') private readonly stakeModel: Model<Stake>,
  ) {}

  async fullClaimStake(fc_stake_payload: {
    stakeId: string;
    creatorId: string;
  }) {
    let { creatorId, stakeId } = fc_stake_payload;

    let stakeExists: Stake;
    let userExists: User;

    try {
      userExists = await this.userModel.findOne({ _id: creatorId });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!userExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      stakeExists = await this.stakeModel.findOne({ _id: stakeId });
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
      const updatedStake = await this.stakeModel.findOneAndUpdate(
        { _id: stakeId },
        {
          claimRaised: true,
          claimDate: new Date(),
        },
        {
          new: true,
        },
      );

      //todo: send message to all parties and supervisors

      return updatedStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async verifyParties(partiesIds: string[]): Promise<any> {
    let formatted: Party_Reference[] = [];

    let asmo = await this.userModel.find(
      {
        _id: partiesIds.map((_id) => _id),
        blocked: false,
      },

      async (err, docs) => {
        if (err) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: err,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      },
    );

    asmo.map((e) => {
      formatted.push({
        userId: e['id'],
        hasVerifiedStake: false,
      });
    });

    return formatted;
  }

  async verifySupervisors(supervisorsIds: string[]): Promise<any> {
    let formatted: Party_Reference[] = [];

    let asmo = await this.userModel.find(
      {
        _id: supervisorsIds.map((_id) => _id),
      },
      (err, docs) => {
        if (err) {
          throw new HttpException(
            {
              status: 'failed',
              code: HttpStatus.FORBIDDEN,
              error: err,
            },
            HttpStatus.FORBIDDEN,
          );
        }
      },
    );

    asmo.map((e) => {
      formatted.push({
        userId: e['id'],
        hasVerifiedStake: false,
      });
    });

    return formatted;
  }

  async createStake(stake_payload: createStakeDto) {
    let {
      files,
      parties,
      supervisors,
      name,
      description,
      creatorId,
      dueDate,
      amount,
      currency,
    } = stake_payload;

    const parties_ref_docs: Party_Reference[] = await this.verifyParties(
      parties,
    );

    const supervisors_ref_docs: Party_Reference[] =
      await this.verifySupervisors(supervisors);

    try {
      let newStake: any = {
        name,
        amount,
        dueDate,
        description,
        creatorId,
        claimRaised: false,
        claimed: false,
        currency: currency ?? CurrencyTypes.NAIRA,
        parties: parties_ref_docs,
        supervisors: supervisors_ref_docs,
      };

      newStake = new this.stakeModel(newStake).save();

      return newStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async updateStake(stake_payload: updateStakeDto) {
    let { stakeId } = stake_payload;

    if (!stakeId) stakeId = '61b98da63707355f20432de3';

    let stakeExists: Stake;

    try {
      stakeExists = await this.stakeModel.findOne({ _id: stakeId });
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
      const filter = { _id: stakeId };

      const update = {
        ...stake_payload,
      };

      const updatedStake = await this.stakeModel.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        },
      );

      return updatedStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async preClaimStake(cl_stake_payload: {
    stakeId: string;
    creatorId: string;
  }) {
    let { creatorId, stakeId } = cl_stake_payload;

    let stakeExists: Stake;
    let userExists: User;

    try {
      userExists = await this.userModel.findOne({ _id: creatorId });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!userExists) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      stakeExists = await this.stakeModel.findOne({ _id: stakeId });
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
      const updatedStake = await this.stakeModel.findOneAndUpdate(
        { _id: stakeId },
        {
          claimRaised: true,
          claimDate: new Date(),
        },
        {
          new: true,
        },
      );

      //todo: send message to all parties and supervisors

      return updatedStake;
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, e);
    }
  }

  async verifyStake(ve_stake_payload: { stakeId: string; partyId: string }) {
    let { partyId, stakeId } = ve_stake_payload;

    let foundStake: Stake;
    let foundUser: User;
    let foundPartyRef = false;

    try {
      foundUser = await this.userModel.findOne({ _id: partyId });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    //todo: check if user is party to stake provided

    if (!foundUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      foundStake = await this.stakeModel.findOne({
        _id: stakeId,
        claimed: false,
        claimRaised: true,
      });
    } catch (e) {
      Logger.error(e);

      throw new InternalServerErrorException(null, 'error checking db');
    }

    if (!foundStake) {
      throw new NotAcceptableException(
        null,
        'cannot find record of this stake',
      );
    }

    foundStake['parties'].map((each, idx) => {
      if (each['userId'] === foundUser['_id']) foundPartyRef = true;
    });

    // console.log(foundStake);
    // console.log(foundPartyRef);

    // const updatedStake = await this.stakeModel.updateOne(
    //   { _id: stakeId, 'parties.userId': partyId },
    //   {
    //     $set: {
    //       'items.$.hasVerifiedStake': true,
    //     },
    //   },
    //   {
    //     new: true,
    //   },
    // );

    const updatedStake = await this.stakeModel.updateOne(
      { 'parties.userId': partyId },
      {
        $set: {
          'items.$.hasVerifiedStake': true,
        },
      },
      { new: true },
      (err) => {
        console.log(err);
      },
    );

    return updatedStake;
    // try {
    //   let updatedStake = {
    //     ...ve_stake_payload,
    //   };

    //   new this.stakeModel(updatedStake).save();

    //   return updatedStake;
    // } catch (e) {
    //   Logger.error(e);

    //   throw new InternalServerErrorException(null, e);
    // }
  }
}
