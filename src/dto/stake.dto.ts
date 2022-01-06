import { CurrencyTypes } from 'src/enums';

export class createStakeDto {
  requesterId: string;
  name?: string;
  files?: any;
  creator_id?: string;
  supervisors?: string[];
  amount?: string;
  description?: string;
  currency?: CurrencyTypes;
  parties?: string[];
  due_date?: Date;
}

export class updateStakeDto {
  requesterId: string;
  stakeId: string;
  name: string;
  creator_id: string;
  amount: string;
  description: string;
  currency?: CurrencyTypes;
  due_date: Date;
}
