export interface IToken {
  userId: number;
  time: number;
}

export enum CurrencyTypes {
  NAIRA = 'NAIRA',
  DOLLARS = 'DOLLARS',
}

export enum TransactionTypes {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
}

export enum TransactionState {
  PENDING = 'PENDING',
  DENIED = 'DENIED',
  APPROVED = 'APPROVED',
}

export enum AdminTypes {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NORMAL = 'NORMAL',
}

export enum Genders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
