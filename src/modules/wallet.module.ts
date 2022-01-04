import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserSchema } from 'src/models/user.model';
import { WalletController } from 'src/controllers/wallet.controller';
import { WalletService } from 'src/services/wallet.service';
import { WalletSchema } from 'src/models/wallet.model';
import { AuthModule } from './auth.module';
import { PaystackService } from 'src/services/paystack.service';

config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, PaystackService],
})
export class WalletModule {}
