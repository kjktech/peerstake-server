import * as mongoose from 'mongoose';
import { CurrencyTypes } from 'src/enums';
import { User_Reference, User_ReferenceSchema } from './user.model';

export const StakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    parties: [User_ReferenceSchema],
    description: { type: String },
    amount: { type: String, required: true },
    supervisors: [],
  },
  {
    collection: 'stakes',
    timestamps: true,
  },
);

export interface Stake {
  name: string;
  creator: string;
  supervisors: [];
  amount: string;
  description: string;
  currency: CurrencyTypes;
  parties: User_Reference[];
  save: () => {};
}
