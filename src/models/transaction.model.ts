import * as mongoose from 'mongoose';
import { TransactionTypes } from 'src/enums';

export const TransactionSchema = new mongoose.Schema(
  {
    amount: String,
    type: { type: String, enum: TransactionTypes, required: true },
  },
  { timestamps: true },
);

export interface Transaction {
  amount: string;
  type: TransactionTypes;
}
