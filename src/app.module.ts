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

config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.apxoi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ),
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
