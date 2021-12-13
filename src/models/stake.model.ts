import * as mongoose from 'mongoose';
import { CurrencyTypes } from 'src/enums';
import { UserSchema, User_Reference, User_ReferenceSchema } from './user.model';

export const StakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    parties: [User_ReferenceSchema],
    description: { type: String },
    amount: { type: String, required: true },
    supervisors: [UserSchema],
    dueDate: { type: Date, required: true },
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
  dueDate: Date;
  currency: CurrencyTypes;
  parties: User_Reference[];
  save: () => {};
}
