import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth.module';
import { config } from 'dotenv';
import { CustomerModule } from './modules/customer.module';
import { StakeModule } from './modules/stake.module';
import { AdminModule } from './modules/admin.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './modules/wallet.module';
import { PaystackModule } from 'nestjs-paystack';

config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME, PAYSTACK_TEST_KEY } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.apxoi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ),
    PaystackModule.forRoot({
      apiKey: PAYSTACK_TEST_KEY,
    }),
    AuthModule,
    CustomerModule,
    StakeModule,
    AdminModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
