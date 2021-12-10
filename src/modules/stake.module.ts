import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserSchema } from 'src/models/user.model';
import { StakeController } from 'src/controllers/stake.controller';
import { StakeService } from 'src/services/stake.service';
import { StakeSchema } from 'src/models/stake.model';
import { AuthModule } from './auth.module';

config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Stake', schema: StakeSchema },
    ]),
    AuthModule,
  ],
  controllers: [StakeController],
  providers: [StakeService],
})
export class StakeModule {}
