import * as mongoose from 'mongoose';
import { Genders } from 'src/enums';
import { WalletSchema, Wallet } from 'src/models/wallet.model';

export const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    username: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    gender: {
      type: String,
      enum: Genders,
      default: Genders.MALE,
      required: true,
    },
    wallet: WalletSchema,
  },
  { timestamps: true },
);

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  username: string;
  password: string;
  confirm_password: string;
  gender: string;
  email: string;
  address: string;
  token: string;
  wallet: Wallet;
  save: () => {};
}
