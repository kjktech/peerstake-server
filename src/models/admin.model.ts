import * as mongoose from 'mongoose';
import { AdminTypes } from 'src/enums';

export const AdminSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    type: { type: String, enum: AdminTypes, default: AdminTypes.NORMAL },
    isSuspended: { type: Boolean, required: true, default: false },
    dob: {},
  },
  {
    collection: 'admins',
    timestamps: true,
  },
);

export interface Admin {
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
  isSuspended: boolean;
  save: () => {};
}
