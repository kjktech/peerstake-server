import { CurrencyTypes } from 'src/enums';

export class createStakeDto {
  requesterId: string;
  name?: string;
  files?: any;
  creatorId?: string;
  supervisors?: string[];
  amount?: string;
  description?: string;
  currency?: CurrencyTypes;
  parties?: string[];
  dueDate?: Date;
}

export class updateStakeDto {
  requesterId: string;
  stakeId: string;
  name: string;
  creatorId: string;
  amount: string;
  description: string;
  currency?: CurrencyTypes;
  dueDate: Date;
}
