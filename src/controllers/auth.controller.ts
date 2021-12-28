import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { validator } from 'src/utils/validator';
import { isDateValid } from 'src/utils/helpers';
import { AuthGuard } from '@nestjs/passport';
var moment = require('moment');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('social-login')
  @UseGuards(AuthGuard('google'))
  async socialLogin() {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async socialLoginRediret(@Req() req) {
    return this.authService.googleLogin(req);
  }

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
      resp.json({
        user,
        message: 'operation successful',
      });
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

    if (!isDateValid(dob)) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'invalid dob format. DD/MM/YYYY',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    let _age = moment(moment().format('M/D/YYYY'), 'M/D/YYYY').diff(
      moment(dob, 'M/D/YYYY'),
      'years',
    );

    if (parseInt(_age) < 18) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'You must be above 18 y/o to register',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

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

  @Post('init-reset-password')
  async resetPasswordController(@Req() req, @Res({ passthrough: true }) resp) {
    const { email } = req.body;

    const hasError = validator([
      {
        name: 'email',
        value: email,
        options: { required: true, isEmail: true },
      },
    ]);

    if (!hasError) {
      await this.authService.initResetPassword(email);

      resp.json({
        message: 'email sent successfully',
      });
    } else {
      throw new NotFoundException(null, 'counld not process request');
    }
  }
}
