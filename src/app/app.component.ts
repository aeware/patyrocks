import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, ActionSheetController, LoadingController, Loading, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';

import { Account } from "../models/account/account.interface";

import { AngularFireAuth } from "angularfire2/auth"; 
import { AuthServicesProvider } from '../providers/auth-services/auth-services';
 
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

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
  public userDetails: any;
  public responseData: any;
  public sendPhoto = {
    image:'',
    uuid:''
  }

  constructor(public events: Events, public sanitizer : DomSanitizer,public base64: Base64,private camera: Camera, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public authServices: AuthServicesProvider, public afAuth:AngularFireAuth, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App, public loadingCtrl: LoadingController) {
    this.initializeApp();

    this.events.subscribe('user:created', (user) => {
      this.sendPhoto.uuid = this.account.uuid = user.uuid;
      this.account.name = user.firstname;
      if(user.image){ 
        this.sanitizer.bypassSecurityTrustUrl(user.image);
      }
      this.account.image = user.image;
      this.account.logged = true;
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
  }

  initializeApp() {
    let me = this;
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

    this.platform.ready().then(() => {

      localStorage.clear();
      me.rootPage = 'HomePage';

      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      try {


        //if(!(this.platform.is('cordova') || this.platform.is('mobileweb'))) {
          
          console.log('Não é mobile');

          this.afAuth.authState.subscribe((auth) => {
            if(auth){
              this.account.email = auth.email;
              FCMPlugin.getToken((token) => {
                localStorage.set
                this.account.deviceToken = token;
                this.authServices.postData(this.account, "sessions/token").then((result) => {
                  localStorage.set
                  this.responseData = result;
                  if(this.responseData.account.type == "staff"){
                    this.account.isStaff = true;
                    me.rootPage = 'StaffdashboardPage';
                  }else{
                    me.rootPage = 'HomePage';
                  }
                  this.sendPhoto.uuid = this.account.uuid = this.responseData.account.uuid;
                  this.account.name = this.responseData.account.firstname;
                  if(this.responseData.account.image){ 
                    this.sanitizer.bypassSecurityTrustUrl(this.responseData.account.image);
                  }
                  this.account.image = this.responseData.account.image;
                  this.account.logged = true;
                  localStorage.setItem("account", JSON.stringify(this.responseData.account));
                });
              }, (err) => {
                localStorage.clear();
                me.rootPage = 'HomePage';
              }); 
            }else{
              console.log('usuario nao encontrado');
            }
          });
        //  }
      } catch (error) {
        localStorage.clear();
        me.rootPage = 'HomePage';
        
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

  public takePicture(sourceType) {
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
      console.log(JSON.stringify(err));
      this.presentToast('Error while selecting image.');
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
