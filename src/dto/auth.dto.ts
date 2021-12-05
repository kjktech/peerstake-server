export class SignUpDto {
  first_name: string;
  last_name: string;
  password: string;
  phone_number: number;
  address: string;
  email: string;
  username: string;
  confirm_password: string;
  gender: string;
}

export class SignInDto {
  email: string;
  password: string;
}
