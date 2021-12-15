import * as mongoose from 'mongoose';
import { CurrencyTypes } from 'src/enums';

export const Party_Reference_Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hasVerifiedStake: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

export const StakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creatorId: { type: String, required: true },
    parties: [Party_Reference_Schema],
    description: { type: String },
    amount: { type: String, required: true },
    supervisors: [Party_Reference_Schema],
    dueDate: { type: Date, required: true },
    claimed: { type: Boolean, required: true, default: false },
    claimedRaised: { type: Boolean, required: true, default: false },
    claimDate: { type: Date },
  },
  {
    collection: 'stakes',
    timestamps: true,
  },
);

export interface Stake {
  name: string;
  creatorId: string;
  supervisors?: Party_Reference[];
  amount: string;
  description: string;
  dueDate: Date;
  claimDate?: Date;
  currency: CurrencyTypes;
  parties?: Party_Reference[];
  claimed: boolean;
  claimedRaised: boolean;
  save?: () => {};
}
export interface Party_Reference {
  userId: string;
  hasVerifiedStake: boolean;
}
