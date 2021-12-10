export class SignUpDto {
  first_name: string;
  last_name: string;
  password: string;
  phone_number: number;
  email: string;
  username: string;
  confirm_password: string;
  dob: string;
}

export class SignInDto {
  email: string;
  password: string;
}
