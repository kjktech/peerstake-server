import * as mongoose from 'mongoose';
import { WalletSchema, Wallet } from 'src/models/wallet.model';

export const Paystack_Customer_Reference_Schema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    customer_code: { type: String, required: true },
  },
  {
    collection: 'users',
    timestamps: true,
    _id: false,
  },
);

export const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    blocked: { type: Boolean, required: true, default: false },
    wallet: WalletSchema,
    dob: {},
    paystack_customer_ref: Paystack_Customer_Reference_Schema,
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
  blocked: boolean;
  token: string;
  dob: string;
  wallet: Wallet;
  save: () => {};
}

export interface Paystack_User_Reference {
  id: string;
  customer_code: string;
}
