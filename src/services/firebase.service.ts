import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  firebase: admin.app.App;

  constructor() {
    this.firebase = admin.initializeApp();
  }
}
