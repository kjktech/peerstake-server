import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth.module';
import { config } from 'dotenv';
import { CustomerModule } from './modules/customer.module';
import { StakeModule } from './modules/stake.module';
import { AdminModule } from './modules/admin.module';

config();

// const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const DB_USERNAME = 'root';
const DB_PASSWORD = 'ScMDywWb398yJG5';
const DB_NAME = 'peerstake-db';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.apxoi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ),
    AuthModule,
    CustomerModule,
    StakeModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
