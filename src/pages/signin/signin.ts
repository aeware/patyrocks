import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, AlertController, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
// import { SocialService } from '../../providers/social-services/social-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account.interface";
import { Event } from "../../models/event/event.interface";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
}) 
export class SigninPage {

  loading: Loading;

  account = {} as Account;
  event = {} as Event;
 
  public frmSignin : FormGroup;
  public responseData : any;
  public responseData2 : any;
  public responseData3 : any;

  constructor(public events: Events, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public toast: ToastController, public afAuth:AngularFireAuth, public navCtrl: NavController, public authServices: AuthServicesProvider, public alertCtrl: AlertController) {
    this.frmSignin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }
 
  async doLogin(){
    if(this.frmSignin.valid){
      this.events.publish('user:login', this.account);
    }else{
      if (!this.frmSignin.controls.email.valid) {
        this.events.publish('alerts:toast','Digite seu e-mail.');
      }else if (!this.frmSignin.controls.password.valid) {
        this.events.publish('alerts:toast','Digite sua senha.');
      }
    }

  }
  
  async doLoginFB(){

    this.events.publish('user:loginfb');

  }

  doSingUp(){
    this.navCtrl.setRoot('SignupPage');
  }

  forgotPass(){
    if(this.account.email){
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      this.authServices.postData(this.account, "forgot_pass").then((result) => {
        localStorage.set
        this.responseData = result;
        
        this.loading.dismiss();
        if(this.responseData.success){
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: 'A senha foi enviada para o seu email!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  
                }
              }
            ]
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: this.responseData.status,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  
                }
              }
            ]
          });
          alert.present();
        }
      });
    }else{
      this.events.publish('alerts:toast','Digite seu e-mail.');
    }
    
  }

 
}
