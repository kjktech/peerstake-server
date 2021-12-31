import * as mongoose from 'mongoose';
import { CurrencyTypes } from 'src/enums';
import { TransactionSchema, Transaction } from 'src/models/transaction.model';

export const WalletSchema = new mongoose.Schema(
  {
    transactions: [TransactionSchema],
    balance: { type: Number, default: 0 },
    currency: {
      type: String,
      enum: CurrencyTypes,
      default: CurrencyTypes.NAIRA,
    },
  },
  { timestamps: true },
);

export interface Wallet {
  id: string;
  balance: number;
  currency: CurrencyTypes;
  password: string;
  token: string;
  transactions: Transaction[];
  save?: () => {};
}
