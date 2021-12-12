import { CurrencyTypes } from 'src/enums';
import { User } from 'src/models/user.model';

export class createStakeDto {
  name?: string;
  creator?: string;
  supervisors?: User[];
  amount?: string;
  description?: string;
  currency?: CurrencyTypes;
  parties?: string[];
}

export class updateStakeDto {
  id: string;
  name: string;
  creator: string;
  supervisor: string;
  amount: string;
  description: string;
  parties: string[];
}
