import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, AlertController, LoadingController, Loading, Platform, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
// import { SocialService } from '../../providers/social-services/social-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account.interface";
import { Event } from "../../models/event/event.interface";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
//import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var FCMPlugin;
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
//, private fb: Facebook
  constructor(public events: Events, private platform: Platform, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public toast: ToastController, public afAuth:AngularFireAuth, public navCtrl: NavController, public authServices: AuthServicesProvider, public alertCtrl: AlertController) {
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
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      this.authServices.postData(this.account, "sessions").then((result) => {
        localStorage.set
        this.responseData = result;
        console.log('a');
        console.log(this.responseData);
        if(this.responseData.success){
          try {
              console.log(0);
              this.events.publish('user:created', this.responseData.account);
              console.log(1);
              this.account.email = this.responseData.account.email;
              this.account.name = this.responseData.account.firstname;
              this.account.logged = true;
              console.log(2);
              if(this.responseData.account.type == "staff"){
                this.account.isStaff = true;
              }else
              this.account.isStaff = false;
              console.log(3);
              localStorage.setItem("account", JSON.stringify(this.responseData.account));
              console.log(4);
              this.event = JSON.parse(localStorage.getItem('empenho'));
              console.log(5);
              if(this.event){
                this.event.uuid = this.responseData.account.uuid;
                  this.authServices.postData({ uuid: this.event.uuid, euid: this.event.uid}, "connect_event").then((result) => {
                    localStorage.set
                    this.responseData3 = result;
                  });
                this.navCtrl.setRoot('PaymentPage');
              }
              else{
                if(this.responseData.account.type == "staff"){
                  let alert = this.alertCtrl.create({
                    title: 'Paty Rocks',
                    subTitle: 'Baixe o aplicativo!',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          localStorage.clear();
                          this.navCtrl.setRoot('HomePage');
                        }
                      }
                    ]
                  });
                  alert.present();
                }else{
                  this.navCtrl.setRoot('HomePage');
                }
              }
              console.log(6);
              this.loading.dismiss();
              
            
            
          } catch (error) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Paty Rocks',
              subTitle: 'Houve um problema, tente mais tarde.',
              buttons: ['OK']
            });
            alert.present();
          }
        }else{
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: this.responseData.status,
            buttons: ['OK']
          });
          alert.present();
        }
      }, (err) => {
        this.loading.dismiss();
        if(err.status == 401){
          var retorno = JSON.parse(err._body);
          
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: retorno.status,
            buttons: ['OK']
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: 'Houve um problema em nossos servidores. Tente mais tarde!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.setRoot('HomePage');
                }
              }
            ]
          });
          alert.present();
        }
      });
    }else{
      if (!this.frmSignin.controls.email.valid) {
        this.presentToast('Digite seu e-mail.');
      }else if (!this.frmSignin.controls.password.valid) {
        this.presentToast('Digite sua senha.');
      }
    }
  }

  // async doLoginFB(){
  //   let me = this;
  //   this.loading = this.loadingCtrl.create({
  //     spinner: 'show',
  //     content: 'Carregando...'
  //   });
  //   this.loading.present();

  //   if(this.platform.is('core') || this.platform.is('mobileweb')) {
      
  //     //this.fb.browserInit('138072253579918', '549111bdfa1c347ac4662105ee727652', 'v2.11').then((resp:object)=>{});

  //     this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {

  //       this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {

  //         var res = profile['name'].split(" ");
          
  //         this.account.email = profile['email'];
  //         this.account.name = res[0] + ' ' + res[(res.length-1)];
  //         this.account.image = profile['picture_large']['data']['url'];
  //         this.account.facebookId = profile['id'];
          
  //         this.authServices.postData(this.account, "sessions").then((result) => {
  //           localStorage.set
  //           this.responseData = result;

  //           if(this.responseData.success){
  //             try {
                    
  //               me.account.email = this.responseData.account.email;
  //               me.account.name = this.responseData.account.firstname;
  //               me.account.logged = true;
  
  //               console.log('this.responseData.type2: '+this.responseData.account.type);
  //               if(this.responseData.account.type == "staff"){
  //                 me.account.isStaff = true;
  //               }else
  //                 me.account.isStaff = false;
                
  //               me.events.publish('user:created', this.responseData.account);

  //               localStorage.setItem("account", JSON.stringify(this.responseData.account));
                
  //               this.event = JSON.parse(localStorage.getItem('empenho'));
                
  //               if(this.event){
  //                 this.event.uuid = this.responseData.account.uuid;
  //                   this.authServices.postData({ uuid: this.event.uuid, euid: this.event.uid}, "connect_event").then((result) => {
  //                     localStorage.set
  //                     this.responseData3 = result;
  //                   });
  //                 this.navCtrl.setRoot('PaymentPage');
  //               }
  //               else{
  //                 console.log(me.account);
  //                 if(this.responseData.account.type == "staff"){
  //                   let alert = this.alertCtrl.create({
  //                     title: 'Paty Rocks',
  //                     subTitle: 'Baixe o aplicativo!',
  //                     buttons: [
  //                       {
  //                         text: 'OK',
  //                         handler: () => {
  //                           localStorage.clear();
  //                           this.navCtrl.setRoot('HomePage');
  //                         }
  //                       }
  //                     ]
  //                   });
  //                   alert.present();
  //                 }else{
  //                   if(this.responseData.account.first)
  //                     this.navCtrl.setRoot('OthersDataPage');
  //                   else
  //                     this.navCtrl.setRoot('HomePage');
  //                 }
  //               }
  //               this.loading.dismiss();
  //             } catch (error) {
  //               this.loading.dismiss();
  //               let alert = this.alertCtrl.create({
  //                 title: 'Paty Rocks',
  //                 subTitle: 'Houve um problema, tente mais tarde.',
  //                 buttons: ['OK']
  //               });
  //               alert.present();
  //             }
  //           }else{
  //             this.loading.dismiss();
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: this.responseData.status,
  //               buttons: ['OK']
  //             });
  //             alert.present();
  //           }
  //         }, (err) => {
  //           this.loading.dismiss();
  //           if(err.status == 401){
  //             var retorno = JSON.parse(err._body);
              
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: retorno.status,
  //               buttons: ['OK']
  //             });
  //             alert.present();
  //           }else{
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: 'Houve um problema em nossos servidores. Tente mais tarde!',
  //               buttons: [
  //                 {
  //                   text: 'OK',
  //                   handler: () => {
  //                     this.navCtrl.setRoot('HomePage');
  //                   }
  //                 }
  //               ]
  //             });
  //             alert.present();
  //           }
  //         });
  //       });
  //     }, (err) => {
  //       this.loading.dismiss();
  //     });

  //   } else {
  //     this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
  //       // console.log(JSON.stringify(response));
  //       // if (response.authResponse) {
  //       //   console.log(response.authResponse);
  //       // }
  //       this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
          
  //         var res = profile['name'].split(" ");
          
  //         this.account.email = profile['email'];
  //         this.account.name = res[0] + ' ' + res[(res.length-1)];
  //         this.account.image = profile['picture_large']['data']['url'];
  //         this.account.facebookId = profile['id'];
          
  //         this.authServices.postData(this.account, "sessions").then((result) => {
  //           localStorage.set
  //           this.responseData = result;
            
  //           if(this.responseData.success){
  //             try {
  //               if(this.responseData.account.first){
  //                 this.afAuth.auth.createUserWithEmailAndPassword(this.account.email, '123456');
  //               }else{
  //                 this.afAuth.auth.signInWithEmailAndPassword(this.account.email, '123456');
  //               }
                
  //               FCMPlugin.getToken((token) => {
  //                 localStorage.set
  //                 this.account.deviceToken = token;
                  
                  
  //                 this.authServices.postData(this.account, "sessions/token").then((result) => {
  //                   localStorage.set
  //                   this.responseData2 = result;
                    
  //                   this.account.email = this.responseData2.account.email;
  //                   this.account.name = this.responseData2.account.firstname;
  //                   this.account.logged = true;
      
  //                   if(this.responseData2.account.type == "staff"){
  //                     this.account.isStaff = true;
  //                   }else
  //                     this.account.isStaff = false;
                      
  //                   localStorage.setItem("account", JSON.stringify(this.responseData2.account));
                    
  //                   this.event = JSON.parse(localStorage.getItem('empenho'));
                    
  //                   if(this.event){
  //                     this.event.uuid = this.responseData2.account.uuid;
  //                       this.authServices.postData({ uuid: this.event.uuid, euid: this.event.uid}, "connect_event").then((result) => {
  //                         localStorage.set
  //                         this.responseData3 = result;
  //                       });
  //                     this.navCtrl.setRoot('PaymentPage');
  //                   }
  //                   else{
  //                     if(this.responseData2.type == "staff"){
  //                       this.navCtrl.setRoot('StaffdashboardPage');
  //                     }else{
  //                       if(this.responseData2.account.first)
  //                         this.navCtrl.setRoot('OthersDataPage');
  //                       else
  //                         this.navCtrl.setRoot('HomePage');
  //                     }
  //                   }
  //                   this.loading.dismiss();
  //                 });
  //               });
  //             } catch (error) {
  //               this.loading.dismiss();
  //               let alert = this.alertCtrl.create({
  //                 title: 'Paty Rocks',
  //                 subTitle: 'Houve um problema, tente mais tarde.',
  //                 buttons: ['OK']
  //               });
  //               alert.present();
  //             }
  //           }else{
  //             this.loading.dismiss();
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: this.responseData.status,
  //               buttons: ['OK']
  //             });
  //             alert.present();
  //           }
  //         }, (err) => {
  //           this.loading.dismiss();
  //           if(err.status == 401){
  //             var retorno = JSON.parse(err._body);
              
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: retorno.status,
  //               buttons: ['OK']
  //             });
  //             alert.present();
  //           }else{
  //             let alert = this.alertCtrl.create({
  //               title: 'Paty Rocks',
  //               subTitle: 'Houve um problema em nossos servidores. Tente mais tarde!',
  //               buttons: [
  //                 {
  //                   text: 'OK',
  //                   handler: () => {
  //                     this.navCtrl.setRoot('HomePage');
  //                   }
  //                 }
  //               ]
  //             });
  //             alert.present();
  //           }
  //         });
  //       });
  //     }, (err) => {
  //       this.loading.dismiss();
  //     });
  //   }

      
  // }

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
      this.presentToast('Informe seu email');
    }
    
  }

  presentToast(msg:string) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }

 
}
