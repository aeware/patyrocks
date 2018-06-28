import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, ActionSheetController, LoadingController, Loading, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';

import { Account } from "../models/account/account";
import { Event } from "../models/event/event";
import { Shopping, Cart } from "../models/shopping/shopping";

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

  public isBuildMobile = false;

  rootPage: string = 'HomePage';

  unlogged: Array<{title: string, component: string}>;
  staffPages: Array<{title: string, component: string}>;
  userPages: Array<{title: string, component: string}>;

  loading: Loading;
  public userDetails: any;
  public responseData: any;
  public _ret: any;
  public sendPhoto = {
    image:'',
    uuid:''
  }

  constructor(public shopp: Shopping, public event: Event, public account: Account, public socialCtrl: SocialService, public events: Events, private fb: Facebook, public alertCtrl: AlertController, public sanitizer : DomSanitizer,public base64: Base64,private camera: Camera, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public authServices: AuthServicesProvider, public afAuth:AngularFireAuth, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public app: App, public loadingCtrl: LoadingController) {
    this.clear_account();

    this.clear_shopp();

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
          if(this.isBuildMobile) {
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
          if(this.isBuildMobile) {
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

    this.events.subscribe('user:reg_others', (user_others) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();

      this.authServices.postData(user_others, "regupdate").then((result) => {
        localStorage.set
        this.responseData = result;
        console.log(JSON.stringify(user_others));
        if(this.responseData.success){
          this.loading.dismiss();
          if(this.shopp.finished)
            this.nav.setRoot('PaymentPage');
          else
            this.nav.setRoot('HomePage');

        }
      }, (err) => {
        this.loading.dismiss();
        
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
      });
    });

    this.events.subscribe('user:loginfb', () => {
      
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();

        this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
          this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
            this.facebookLogin(profile);
          });
        }).catch(e => {
          // código de erro do close
          // if(e.errorCode == "4201"){
          // }
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: 'Houve um problema em nossos servidores. Tente mais tarde!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.loading.dismiss();
                  this.nav.setRoot('HomePage');
                }
              }
            ]
          });
          alert.present();
        });
      //}
      
    });

    this.events.subscribe('alerts:toast', (text, timer, position) => {
      this.toaster(text, timer, position);
    });

    this.events.subscribe('alerts:contactUs', () => {
      this.faleComPaty();
    });

    this.events.subscribe('alerts:otherChannels', () => {
      let alert = this.alertCtrl.create({
        title: '<img src="assets/imgs/logo.png" style="height: 44px;"/>',
        subTitle: 'Utilize um de nossos canais de atendimento!',
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
              this.nav.setRoot('HomePage');
            }
          }
        ]
      });
      alert.present();
    });

    this.events.subscribe('shopping:add', (item = null, redirect = true) => {
      if(redirect){
        this.loading = this.loadingCtrl.create({
          spinner: 'show',
          content: 'Carregando...'
        });
        this.loading.present();
      }
      this.authServices.postData({ user_uid: this.account.uuid, item: item}, "shopping/" + this.shopp.shopping_uid + "/add").then((result) => {
        localStorage.set
        this.responseData = result;
        if(this.responseData.success){
          if(item){
            item.forEach(it => {
              if(it.qty == true)
                it.qty = 1;
              let c: Cart = {
                product_id : it.product_id,
                name : it.name,
                title_pop : it.title_pop,
                tag : it.tag,
                type : it.type,
                image : it.image,
                image_description : it.image_description,
                description : it.description,
                vector : it.vector,
                qty: it.qty,
                duration: it.duration,
                attendees: it.attendees,
                value: it.value,
                total: it.total
              };
              this.shopp.items.push(c);
            });
          }
          this.shopp.items_total = this.responseData.cart.items_total;
          this.shopp.shopping_uid = this.responseData.cart.shopping_uid;
          
          if(redirect){
            this.loading.dismiss();
            this.nav.setRoot('CartPage');
          }
          this.calculateTotal();
        }
      }, (err) => {
        this.loading.dismiss();
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
      });
    });

    this.events.subscribe('shopping:remove', (item, index) => {
      
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      
      this.authServices.postData({item: item}, "shopping/" + this.shopp.shopping_uid + "/remove").then((result) => {
        localStorage.set
        this.responseData = result;

        if(this.responseData.success){
          this.shopp.items_total = 0;
          this.shopp.total_value = 0.0;
          this.shopp.user_uid = '';
          this.shopp.items = [];

          if(this.responseData.cart.items){
            this.responseData.cart.items.forEach(it => {
              let c: Cart = {
                product_id : it.product_id,
                name : it.product,
                title_pop : null,
                tag : it.tag,
                type : it.type,
                image : it.image,
                image_description : it.image_description,
                description : it.description,
                vector : null,
                qty: it.quantity,
                duration: it.duration,
                attendees: it.attendees,
                value: parseFloat(it.value),
                total: parseFloat(it.value)
              };
              this.shopp.items.push(c);
            });
          }
          this.shopp.shopping_uid = this.responseData.cart.shopping_uid;
          this.shopp.user_uid = this.responseData.cart.user_uid;
          this.shopp.items_total = this.responseData.cart.items_total;
          this.calculateTotal();
        }else{
          this.shopp.items.push(item);
          this.toaster('Houve um problema ao remover. Tente mais tarde.');
        }
        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.shopp.items.push(item);
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: 'Houve um problema ao remover. Tente mais tarde.',
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
      });
    });

    this.events.subscribe('shopping:cart', () => {
      if(this.shopp.items_total > 0)
        this.nav.setRoot('CartPage');
    });

    this.events.subscribe('shopping:cancel', (shopping_uid, view) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
    
      this.authServices.getData("shopping/" + shopping_uid + "/cancel").then((result) => {
        localStorage.set
        this.responseData = result;
        if(this.responseData.success){
          this.loading.dismiss();
          view.dismiss();
          this.nav.setRoot('MyeventsPage');
          this.toaster("Evento cancelado com sucesso.");

        }else{
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Paty Rocks',
            subTitle: 'Houve um problema para cancelar o evento!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  view.dismiss();
                  this.nav.setRoot('MyeventsPage');
                }
              }
            ]
          });
          alert.present();
        }
      }, (err) => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: 'Houve um problema em nossos servidores. Tente mais tarde!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                view.dismiss();
                this.nav.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      });
    });

    this.events.subscribe('shopping:load_shopp', (shopping_uid, view) => {
      this.getLastShooping(this.account.uuid, shopping_uid);
      view.dismiss();
      this.nav.setRoot('HomePage');
      this.nav.push('ModalDetailsPage');
    });
    
    this.events.subscribe('shopping:checkout', (event) => {
      
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      
      this.authServices.postData({ user_uid: this.account.uuid, event: event }, "shopping/" + this.shopp.shopping_uid + "/checkout").then((result) => {
        localStorage.set
        this.responseData = result;
        if(this.responseData.success){
          this.loading.dismiss();
          
          if(this.account.uuid == ""){
            this.shopp.finished = true;
            this.nav.setRoot('SigninPage');  
          }else{
            this.nav.push('PaymentPage');
          }
        }else{
          this.loading.dismiss();
        }
      }, (err) => {
        this.loading.dismiss();
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
      });
    });

    this.events.subscribe('shopping:pay', (card) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      
      this.authServices.postData(card, "shopping/" + this.shopp.shopping_uid + "/shopping_pay").then((result) => {
        localStorage.set
        this.responseData = result;
        
        if(this.responseData.success){
          
          this.clear_event();
          this.clear_shopp();

          this.loading.dismiss();
          this.nav.setRoot('PaymentOkPage');
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
        var retorno = JSON.parse(err._body);
  
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: retorno.status,
          buttons: ['OK']
        });
        alert.present();
      });
    });

    this.events.subscribe('shopping:checkout_details', () => {
      
      this.nav.push('ModalDetailsPage');

    });

    this.events.subscribe('services:rate', (event, view) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();
      console.log(event);
      this.authServices.postData(event, "services/rates").then((result) => {
        localStorage.set
        this.responseData = result;
        
        if(this.responseData.success){
          
          this.clear_event();
          this.clear_shopp();

          this.loading.dismiss();
          view.dismiss();
          this.nav.setRoot('MyeventsPage');
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
        var retorno = JSON.parse(err._body);
  
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: retorno.status,
          buttons: ['OK']
        });
        alert.present();
      });
    });

    this.events.subscribe('page:home', () => {
        this.nav.setRoot('HomePage');
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
 
  calculateTotal(){
    this.shopp.total_value = 0;
    this.shopp.items.forEach(element => {
      this.shopp.total_value += element.total;
    });
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
        if(this.isBuildMobile) {
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

        if(this.isBuildMobile)
          this.afAuth.auth.signOut();
      }
    }, (err) => {
      this.loading.dismiss();
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
    });
  }

  //after session opened. With or without FCM
  updateAccount(_dados){
    if(_dados.type == "staff")
      this.account.isStaff = true;
    else
      this.account.isStaff = false;

    this.sendPhoto.uuid = this.account.uuid = _dados.uuid;

    if(this.shopp.items_total > 0){
      this.events.publish('shopping:add', null, false);
    }else{
      this.getLastShooping(_dados.uuid);
    }

    this.account.name = _dados.firstname;
    if(_dados.image){ 
      this.sanitizer.bypassSecurityTrustUrl(_dados.image);
    }
    this.account.image = _dados.image;
    this.account.logged = true;

    // localStorage.setItem("account", JSON.stringify(_dados));
    this.redirectToPage(this.responseData.account.type, _dados.first);

  }

  getLastShooping(user_uid, shopping_uid = ""){
    this.authServices.getData("user/" + user_uid + "/cart/" + shopping_uid).then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){

        this.clear_event();
        this.clear_shopp();

        if(this.responseData.cart.address){
          this.event.uid = this.responseData.cart.shopping_uid;
          this.event.attendees = this.responseData.cart.attendees;
          this.event.duration = this.responseData.cart.duration;
          this.event.type = this.responseData.cart.event_type_id;
          this.event.dateStart = this.responseData.cart.event_start;
          this.event.timeStarts = this.responseData.cart.event_start;
          this.event.valueTotal = this.responseData.cart.total_value;
          this.event.uuid = this.responseData.cart.user_id;

          this.event.auid = this.responseData.cart.address.uid;
          this.event.city = this.responseData.cart.address.city;
          this.event.country = this.responseData.cart.address.country;
          this.event.lat = this.responseData.cart.address.lat;
          this.event.lng = this.responseData.cart.address.lng;
          this.event.neighborhood = this.responseData.cart.address.neighborhood;
          this.event.number = this.responseData.cart.address.number;
          this.event.complement = this.responseData.cart.address.complement;
          this.event.state = this.responseData.cart.address.state;
          this.event.street = this.responseData.cart.address.street;
          this.event.zipcode = this.responseData.cart.address.zipcode;
          this.event.location = this.responseData.cart.location_complete;
        }

        this.shopp.items_total = this.responseData.cart.items_total;
        this.shopp.total_value = this.responseData.cart.total_value;
        this.shopp.shopping_uid = this.responseData.cart.shopping_uid;

        this.responseData.cart.items.forEach(it => {
          let c: Cart = {
            product_id : it.product_id,
            name : it.product,
            title_pop : null,
            tag : it.tag,
            type : it.type,
            image : it.image,
            image_description : it.image_description,
            description : it.description,
            vector : null,
            qty: it.quantity,
            duration: it.duration,
            attendees: it.attendees,
            value: parseFloat(it.value),
            total: parseFloat(it.value)
          };
          this.shopp.items.push(c);
        });
      }else{
      }
    }, (err) => {
      this.loading.dismiss();
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
    });
  }

  //redirect to the right page
  redirectToPage(_type, facebook_first){
    this.loading.dismiss();
    if(facebook_first){
      this.nav.setRoot('OthersDataPage');
    }else if(_type == "staff"){
      if(!(this.isBuildMobile)) {
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
      if(this.shopp.finished)
        this.nav.setRoot('PaymentPage');
      else
        this.nav.setRoot('HomePage');
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
    }, (err) => {
      this.loading.dismiss();
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
        if(!(this.isBuildMobile)) {
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

  clear_event(){
    this.event.uid = '';
    this.event.attendees = null;
    this.event.duration = 0;
    this.event.type = '';
    this.event.dateStart = '';
    this.event.timeStarts = '';
    this.event.valueTotal = 0;
    this.event.uuid = '';
    this.event.auid = null;
    this.event.city = '';
    this.event.country = '';
    this.event.lat = '';
    this.event.lng = '';
    this.event.neighborhood = '';
    this.event.number = '';
    this.event.complement = '';
    this.event.state = '';
    this.event.street = '';
    this.event.zipcode = '';
    this.event.location = '';
  }
  clear_account(){
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
  }

  clear_shopp(){
    this.shopp.items_total = 0;
    this.shopp.total_value = 0.0;
    this.shopp.shopping_uid = 'N';
    this.shopp.user_uid = '';
    this.shopp.items = [];
  }
 
  doLogin(){
    this.nav.setRoot('SigninPage');
  }

  doLogout(){

    if(this.isBuildMobile)
      this.afAuth.auth.signOut();

    localStorage.clear();

    this.clear_event();
    this.clear_shopp();
    this.clear_account();

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
