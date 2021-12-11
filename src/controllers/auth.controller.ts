import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { validator } from 'src/utils/validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: SignInDto,
  ) {
    const { password, email } = body;

    //* run validation on the request body. return a boolean to affrim that the syntax is correct.
    const hasError = validator([
      {
        name: 'email',
        value: email,
        options: { required: true, isEmail: true },
      },
      {
        name: 'password',
        value: password,
        options: {
          required: true,
          isPassword: true,
          lengthLesserThan: 20,
          lengthGreatherThan: 8,
        },
      },
    ]);

    //* If no errors are present, send request body to the service
    if (!hasError) {
      //* service performs all operations and returns a response
      const user = await this.authService.signIn(body);

      //* return response from server
      return {
        user,
        message: 'operation successful',
      };
    } else {
      throw new NotFoundException(null, 'Invalid email/password');
    }
  }

  @Post('register')
  async regsiterController(
    @Req() req,
    @Res({ passthrough: true }) resp,
    @Body() body: SignUpDto,
  ) {
    const {
      username,
      password,
      confirm_password,
      first_name,
      last_name,
      email,
      dob,
    } = body;

    const hasError = validator([
      {
        name: 'password',
        value: password,
        options: {
          required: true,
          isString: true,
          lengthGreatherThan: 8,
          lengthLesserThan: 20,
          isPassword: true,
        },
      },
      {
        name: 'username',
        value: username,
        options: { required: true, isString: true },
      },
      {
        name: 'confirm password',
        value: confirm_password,
        options: { required: true, isString: true, equalTo: password },
      },
      {
        name: 'firstname',
        value: first_name,
        options: { required: true, isString: true },
      },
      {
        name: 'lastname',
        value: last_name,
        options: { required: true, isString: true },
      },
      {
        name: 'email',
        value: email,
        options: { required: true, isString: true, isEmail: true },
      },
      {
        name: 'date of birth',
        value: dob,
        options: { required: true, isString: true },
      },
    ]);

    if (!hasError) {
      const user = await this.authService.signUp(body);

      resp.json({ user, description: 'operaton sucessful', code: 0 });
    } else {
      resp.json({
        status: 'failed',
        description: hasError?.[0].msg[0],
        code: 406,
      });
    }
  }
}
