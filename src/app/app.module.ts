import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from "./app.firebase.config";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServicesProvider } from '../providers/auth-services/auth-services';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';

import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
      monthShortNames: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
      dayNames:['domingo','segunda','terça','quarta','quinta','sexta','sábado'],
      dayShortNames:['dom','seg','ter','qua','qui','sex','sab']
    }),
    Ionic2RatingModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    AuthServicesProvider,
    AngularFireAuth
  ],
  schemas:[
    Ionic2RatingModule
  ]
})

export class AppModule {}