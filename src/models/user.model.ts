import * as mongoose from 'mongoose';
import { Genders } from 'src/enums';
import { WalletSchema, Wallet } from 'src/models/wallet.model';

export const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    wallet: WalletSchema,
    dob: {},
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: number;
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  token: string;
  dob: string;
  wallet: Wallet;
  save: () => {};
}
