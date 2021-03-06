import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserSchema } from 'src/models/user.model';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { jwt_expire_time, jwt_secret } from 'src/constants';
import { GoogleStrategy } from 'src/utils/google-strategy';
import { PaystackService } from 'src/services/paystack.service';
import { WalletService } from 'src/services/wallet.service';

config();

const jwtConfig = JwtModule.register({
  secret: jwt_secret,
  signOptions: { expiresIn: `${jwt_expire_time}s` },
});

@Module({
  imports: [
    jwtConfig,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, PaystackService, WalletService],
  exports: [AuthService],
})
export class AuthModule {}
