import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, ActionSheetController, LoadingController, Loading, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';

import { Account } from "../models/account/account.interface";
import { Event } from "../models/event/event.interface";

import { AngularFireAuth } from "angularfire2/auth"; 
import { AuthServicesProvider } from '../providers/auth-services/auth-services';
 
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

import {SocialService} from '../providers/social-services/social-services';
import {Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

declare var FCMPlugin:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  unlogged: Array<{title: string, component: string}>;
  staffPages: Array<{title: string, component: string}>;
  userPages: Array<{title: string, component: string}>;


  loading: Loading;
  account = {} as Account;
  event = {} as Event;
  public userDetails: any;
  public responseData: any;
  public _ret: any;
  public sendPhoto = {
    image:'',
    uuid:''
  }

  constructor(public socialCtrl: SocialService, public events: Events, private fb: Facebook, public alertCtrl: AlertController, public sanitizer : DomSanitizer,public base64: Base64,private camera: Camera, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public authServices: AuthServicesProvider, public afAuth:AngularFireAuth, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App, public loadingCtrl: LoadingController) {
    this.account.uuid = ''; 
    this.account.name = '';
    this.account.image = '';
    this.account.email = '';
    this.account.password = '';
    this.account.deviceToken = '';
    this.account.facebookId = '';
    this.account.isStaff = false;
    this.account.logged = false;
    this.account.notifications = 0;

    this.events.subscribe('user:logged', (user) => {
      this.sendPhoto.uuid = this.account.uuid = user.uuid;
      this.account.name = user.firstname;
      if(user.image){ 
        this.sanitizer.bypassSecurityTrustUrl(user.image);
      }
      this.account.image = user.image;
      this.account.logged = true;
    });

    this.events.subscribe('user:signup', (user) => {

      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      
      this.authServices.postData(user, "register").then((result) => {
        localStorage.set
        this.responseData = result;

        if(this.responseData.success){
          //IF MOBILE
          if(this.platform.is('ios') || this.platform.is('android')) {
            this.registerFirebase(this.responseData.account.email);
          }
          this.updateAccount(this.responseData.account);
          
        }else{
          this.toaster(this.responseData.status);
        }

        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        if(err.status == 409){
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
                  this.nav.setRoot('HomePage');
                }
              }
            ]
          });
          alert.present();
        }
      });
    });

    this.events.subscribe('user:login', (user) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...' 
      });
      this.loading.present();

      this.account.email = user.email;
      this.account.password = user.password;

      this.authServices.postData(user, "sessions").then((result) => {
        localStorage.set
        this.responseData = result;
        if(this.responseData.success){

          //IF MOBILE
          if(this.platform.is('ios') || this.platform.is('android')) {
            this.registerFirebase(this.responseData.account.email);
          }
          this.updateAccount(this.responseData.account);
          
        }else{
          this.loading.dismiss();
          this.toaster(this.responseData.status);
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
                  this.nav.setRoot('HomePage');
                }
              }
            ]
          });
          alert.present();
        }
      });
    });

    this.events.subscribe('user:loginfb', () => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();

      if(!(this.platform.is('ios') || this.platform.is('android'))){
        this.socialCtrl.fbLogin()
          .then(res=>{
            this.facebookLogin(res);
          })
          .catch(err=>{
            this.loading.dismiss();
          });
      }else{
        this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
          this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
            this.facebookLogin(profile);
          });
  
        }).catch(e => {
          // código de erro do close
          // if(e.errorCode == "4201"){
          // }
          this.loading.dismiss();
        });
      }
      
    });

    this.events.subscribe('alerts:toast', (text, timer, position) => {
      this.toaster(text, timer, position);
    });

    this.events.subscribe('alerts:contactUs', () => {
      this.faleComPaty();
    });
    this.unlogged = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Perguntas Frequentes', component: 'FaqPage' },
      { title: 'Entre em Contato', component: 'ContactusPage' },
      { title: 'Sobre Nós', component: 'AboutusPage' }
    ];

    this.staffPages = [
      { title: 'Meus Convites', component: 'StaffdashboardPage' },
      { title: 'Meus Eventos', component: 'StaffeventsPage' },
      { title: 'Perguntas Frequentes', component: 'FaqPage' },
      { title: 'Entre em Contato', component: 'ContactusPage' },
      { title: 'Sobre Nós', component: 'AboutusPage' }
    ];

    this.userPages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Meus Eventos', component: 'MyeventsPage' },
      { title: 'Perguntas Frequentes', component: 'FaqPage' },
      { title: 'Entre em Contato', component: 'ContactusPage' },
      { title: 'Sobre Nós', component: 'AboutusPage' }
    ];


    this.initializeApp();
  }



  // this.updateAccount(this.responseData.account);
  // this.redirectToPage(this.responseData.account.type);

  //with FCM - from login
  registerFirebase(_email){

    //autocalling subscribe event (FCMConnect)
    this.afAuth.auth.signInWithEmailAndPassword(_email, '123456').catch(error => {
      if(error.code == 'auth/user-not-found'){
        this.afAuth.auth.createUserWithEmailAndPassword(_email, '123456');
      }else{
        this.toaster('Houve um erro na conexão. Tente mais tarde.');
      }
    });
  }

  //with FCM - automatic login
  FCMConnect(){
    this.afAuth.authState.subscribe((auth) => {
      if(auth){
        this.account.email = auth.email;
        this.FCMgetToken(auth.email);
      }
    });
  }

  FCMgetToken(_email){
    FCMPlugin.getToken((token) => {
      localStorage.set
      this.account.deviceToken = token;
      this.updateToken(token, _email);
    });
  }

  //when FacebookLogin
  facebookLogin(profile){
    var res = profile['name'].split(" ");
            
    this.account.email = profile['email'];
    this.account.name = res[0] + ' ' + res[(res.length-1)];
    this.account.image = profile['picture_large']['data']['url'];
    this.account.facebookId = profile['id'];

    this.authServices.postData(this.account, "sessions").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        //IF MOBILE
        if(this.platform.is('ios') || this.platform.is('android')) {
          this.registerFirebase(this.responseData.account.email);
        }else{
          this.updateAccount(this.responseData.account);
        }       

      }else{
        this.loading.dismiss();
        this.toaster(this.responseData.status);
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
                this.nav.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  //aftar FCM login
  updateToken(_deviceToken, _email){
    this.authServices.postData({ 'deviceToken': _deviceToken, 'email': _email}, "sessions/token").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        this.updateAccount(this.responseData.account);
      }else{
        this.toaster('Houve um problema com o login. Logue-se novamente.');

        if(this.platform.is('ios') || this.platform.is('android'))
          this.afAuth.auth.signOut();
      }
    });
  }


  //after session opened. With or without FCM
  updateAccount(_dados){
    if(_dados.type == "staff")
      this.account.isStaff = true;
    else
      this.account.isStaff = false;

    this.sendPhoto.uuid = this.account.uuid = _dados.uuid;
    this.account.name = _dados.firstname;
    if(_dados.image){ 
      this.sanitizer.bypassSecurityTrustUrl(_dados.image);
    }
    this.account.image = _dados.image;
    this.account.logged = true;

    localStorage.setItem("account", JSON.stringify(_dados));
    this.redirectToPage(this.responseData.account.type, _dados.first);

  }


  //redirect to the right page
  redirectToPage(_type, facebook_first){
    this.loading.dismiss();
    if(facebook_first){
      this.nav.setRoot('OthersDataPage');
    }else if(_type == "staff"){
      if(!(this.platform.is('ios') || this.platform.is('android'))) {
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: 'Baixe o aplicativo!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.nav.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      }else{
        this.rootPage = 'StaffdashboardPage';
      }
    }else{
      this.event = JSON.parse(localStorage.getItem('empenho'));

      if(this.event){
        this.redirectToEvent(this.event);
      }
      else{
          this.rootPage = 'HomePage';
          this.nav.setRoot('HomePage');
      }
    }
  }

  // have an event on localstorage
  redirectToEvent(_event){
    this.authServices.postData({ uuid: this.account.uuid, euid: _event.uid}, "connect_event").then((result) => {
      localStorage.set
      this._ret = result;

      if(this._ret.success){
        this.nav.setRoot('PaymentPage');
      }else{
        this.nav.setRoot('HomePage');
      }
    });
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
 
      localStorage.clear();
      this.rootPage = 'HomePage';

      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      try {
        if(!(this.platform.is('ios') || this.platform.is('android'))) {
          this.rootPage = 'HomePage';
        }else{
          this.FCMConnect();
        }
          
      } catch (error) {
        localStorage.clear();
        this.rootPage = 'HomePage';
        
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.loading.dismiss();
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loading.dismiss();
      
    });
  }
 
  doLogin(){
    this.nav.setRoot('SigninPage');
  }

  doLogout(){

    if(this.platform.is('ios') || this.platform.is('android'))
      this.afAuth.auth.signOut();

    localStorage.clear();
    this.account.name = '';
    this.account.logged = false;
    this.account.isStaff = false;

    this.nav.setRoot('HomePage');

  }


  editUser() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecione a forma:',
      buttons: [
        {
          text: 'Carregar da Biblioteca',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    this.camera.getPicture(options).then((imagePath) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...' 
      });
      this.loading.present();
      this.base64.encodeFile(imagePath).then((base64String: string) => {
        
        //let imageSrc = base64String.split(",");
        
        this.sendPhoto.image = base64String;
        this.authServices.postData(this.sendPhoto, "uploadimg").then((result) => {
          localStorage.set
          this.responseData = result;
          this.account.image = this.responseData.account.image;
          this.loading.dismiss();
        });
      });
    }, (err) => {
      this.loading.dismiss();

      this.toaster('Error while selecting image.');

    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  faleComPaty(){
    let alert = this.alertCtrl.create({
      title: '<img src="assets/imgs/logo.png" style="height: 44px;"/>',
      subTitle: 'Fale com a Paty!',
      buttons: [
        {
          text: 'Whatsapp',
          handler: () => {
            window.location.href = 'https://api.whatsapp.com/send?phone=5521965135903&text=Ol%C3%A1%20Paty,%20gostaria%20de%20solicitar%20um%20or%C3%A7amento';
          }
        },
        {
          text: 'Email',
          handler: () => {
            window.location.href = 'mailto:contato@patyrocks.com';
          }
        },
        {
          text: 'Voltar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();

  }

  toaster(text, timer = 3000, position = 'top'){
    let toast = this.toastCtrl.create({
      message: text,
      duration: timer,
      position: position
    });
    toast.present();
  }

}
