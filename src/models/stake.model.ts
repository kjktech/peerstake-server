import * as mongoose from 'mongoose';
import { CurrencyTypes, DisputeStatus } from 'src/enums';

export const Party_Reference_Schema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    has_verified_stake: { type: Boolean, required: true, default: false },
    has_accepted_stake_invite: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Stake_Dispute_Schema = new mongoose.Schema(
  {
    disputer_id: { type: String, required: true },
    details: { type: String, required: true },
    status: { type: String, enum: DisputeStatus, default: DisputeStatus.OPEN },
  },
  {
    timestamps: true,
  },
);

export const StakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator_id: { type: String, required: true },
    parties: [Party_Reference_Schema],
    description: { type: String },
    amount: { type: String, required: true },
    supervisors: [Party_Reference_Schema],
    due_date: { type: Date, required: true },
    claimed: { type: Boolean, required: true, default: false },
    claim_raised: { type: Boolean, required: true, default: false },
    claim_date: { type: Date },
    disputes: [Stake_Dispute_Schema],
  },
  {
    collection: 'stakes',
    timestamps: true,
  },
);

export interface Stake {
  name: string;
  creator_id: string;
  supervisors?: Party_Reference[];
  amount: string;
  description: string;
  due_date: Date;
  claim_date?: Date;
  currency: CurrencyTypes;
  parties?: Party_Reference[];
  disputes?: Stake_Dispute[];
  claimed: boolean;
  claimed_raised: boolean;
  save?: () => {};
}
export interface Party_Reference {
  user_id: string;
  has_verified_stake: boolean;
  has_accepted_stake_invite: boolean;
}
export interface Stake_Dispute {
  details: string;
  status: string;
}
