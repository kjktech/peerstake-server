import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

config();

const firebaseConfig = {
  apiKey: 'AIzaSyBUxrFVKYzJR15umtd-NIHJEhXN8n1XAV4',
  authDomain: 'peerstake-e36c0.firebaseapp.com',
  projectId: 'peerstake-e36c0',
  storageBucket: 'peerstake-e36c0.appspot.com',
  messagingSenderId: '708840893772',
  appId: '1:708840893772:web:69ff57d5743a1ea6a933e9',
  measurementId: 'G-P1374PFF60',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService: ConfigService = app.get(ConfigService);

  // const adminConfig: ServiceAccount = {
  //   projectId: configService.get<string>('peerstake-e36c0'),
  //   privateKey: configService.get<string>(
  //     'AIzaSyBUxrFVKYzJR15umtd-NIHJEhXN8n1XAV4',
  //   ),
  //   // ?.replace(/\\n/g, '\n'),
  //   clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  // };

  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  // });

  app.enableCors();

  // await app.listen(configService.get<string>('API_PORT') || 4000);

  await app.listen(process.env.PORT || 9000);
}
bootstrap();
