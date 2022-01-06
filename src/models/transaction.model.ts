import * as mongoose from 'mongoose';
import { TransactionTypes } from 'src/enums';

export const Paystack_Transaction_Reference_Schema = new mongoose.Schema(
  {
    access_code: { type: String, required: true },
    reference: { type: String, required: true },
    fee: { type: String },
  },
  {
    collection: 'users',
    timestamps: true,
    _id: false,
  },
);

export const TransactionSchema = new mongoose.Schema(
  {
    amount: String,
    type: { type: String, enum: TransactionTypes, required: true },
    paystack_transaction_ref: Paystack_Transaction_Reference_Schema,
  },
  { timestamps: true },
);

export interface Transaction {
  amount: string;
  type: TransactionTypes;
}

export interface Paystack_Transaction_Reference {
  access_code: string;
  reference: string;
  fee: string;
}
