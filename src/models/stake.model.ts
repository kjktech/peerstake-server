import * as mongoose from 'mongoose';
import { CurrencyTypes } from 'src/enums';
import { User, UserSchema } from './user.model';

export const StakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: Number, required: true },
    parties: [UserSchema],
    description: { type: String },
    amount: { type: String, required: true },
    supervisor: { type: Number },
  },
  {
    collection: 'stakes',
    timestamps: true,
  },
);

export interface Stake {
  name: string;
  creator: string;
  supervisor: string;
  amount: string;
  description: string;
  currency: CurrencyTypes;
  parties: User[];
  save: () => {};
}
