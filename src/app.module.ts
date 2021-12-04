import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const DB_USERNAME = 'root';
const DB_PASSWORD = 'ScMDywWb398yJG5';
const DB_NAME = 'Cluster0';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.apxoi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      { dbName: DB_NAME },
    ),
    // AuthModule,
    // BankModule,
    // AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
