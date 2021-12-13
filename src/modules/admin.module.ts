import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { AdminController } from 'src/controllers/admin.controller';
import { AdminService } from 'src/services/admin.service';
import { jwt_expire_time, jwt_secret } from 'src/constants';
import { AdminSchema } from 'src/models/admin.model';
import { UserSchema } from 'src/models/user.model';

config();

const jwtConfig = JwtModule.register({
  secret: jwt_secret,
  signOptions: { expiresIn: `${jwt_expire_time}s` },
});

@Module({
  imports: [
    jwtConfig,
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
