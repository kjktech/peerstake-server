import { CurrencyTypes } from 'src/enums';
import { User } from 'src/models/user.model';

export class createStakeDto {
  name?: string;
  creator?: string;
  supervisors?: User[];
  amount?: string;
  description?: string;
  currency?: CurrencyTypes;
  parties?: User[];
}

export class updateStakeDto {
  id: string;
  name: string;
  creator: string;
  supervisor: string;
  amount: string;
  description: string;
  parties: User[];
}
