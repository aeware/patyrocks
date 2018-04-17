import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';

import { AngularFireAuthModule } from "angularfire2/auth";

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    IonicPageModule.forChild(SigninPage),
    AngularFireAuthModule
  ],
})
export class SigninPageModule {}
