import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Modal, ModalController, ModalOptions, AlertController, IonicPage, Events, NavController, LoadingController, Loading } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account.interface";
import { Event } from "../../models/event/event.interface";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var FCMPlugin;
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  loading: Loading;
 
  account = {} as Account;
  event = {} as Event;

  public frmSignup : FormGroup;
  public responseData : any;
  public responseData2 : any;
  public responseData3 : any;
  public register = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    phonenumber: '',
    iagree: false
  }

  constructor(public events: Events, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public toast: ToastController, public afAuth:AngularFireAuth, public authServices: AuthServicesProvider, public alertCtrl: AlertController, private modal: ModalController, public navCtrl : NavController) {
    this.frmSignup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      iagree: ['', Validators.required],
      phonenumber:  ['', Validators.required]
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  async singUp(){
    if(this.frmSignup.valid){

      if(this.register.iagree){
        this.loading = this.loadingCtrl.create({
          spinner: 'show',
          content: 'Carregando...'
        });
        this.loading.present();
        
        this.authServices.postData(this.register, "register").then((result) => {
          
          localStorage.set
          this.responseData = result;
          
          this.account.email = this.register.email;
          this.account.logged = true;
          this.account.isStaff = false;
          this.account.name = this.register.firstname;
          try {

              this.events.publish('user:created', this.responseData.account);

              this.afAuth.auth.createUserWithEmailAndPassword(this.account.email, '123456')
              .then((user) => { 
                FCMPlugin.getToken((token) => {
                  localStorage.set
                  this.account.deviceToken = token;
                  this.authServices.postData(this.account, "sessions/token").then((result) => {
                    localStorage.set
                    this.responseData2 = result;
                    localStorage.setItem("account", JSON.stringify(this.responseData2.account));
                    
                    this.event = JSON.parse(localStorage.getItem('empenho'));
              
                    if(this.event){
                      this.event.uuid = this.responseData2.account.uuid;
                      this.authServices.postData({ uuid: this.event.uuid, euid: this.event.uid}, "connect_event").then((result) => {
                        localStorage.set
                        this.responseData3 = result;
                      });

                      this.navCtrl.setRoot('PaymentPage');
                      this.loading.dismiss();
                    }else{
                      this.navCtrl.setRoot('HomePage');
                      this.loading.dismiss();
                    }
                  });
                });  
              }); 

            
          } catch (error) {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Paty Rocks',
              subTitle: 'Houve um problema, tente mais tarde.',
              buttons: ['OK']
            });
            alert.present();
          }
          
        }, (err) => {
          this.loading.dismiss();
          console.log(JSON.stringify(err));
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
                    this.navCtrl.setRoot('HomePage');
                  }
                }
              ]
            });
            alert.present();
          }
        });
      }else{
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: 'Esta de acordo com os termos e condições? Então clique na caixa para continuar.',
          buttons: ['OK']
        });
        alert.present();
      }
    }else{
      if (!this.frmSignup.controls.firstname.valid) {
        this.presentToast('Digite seu primeiro nome.');
      }else if (!this.frmSignup.controls.lastname.valid) {
        this.presentToast('Digite seu último nome.');
      }else if (!this.frmSignup.controls.email.valid) {
        this.presentToast('Digite seu email.');
      }else if (!this.frmSignup.controls.password.valid) {
        this.presentToast('Digite sua senha.');
      }else if (!this.frmSignup.controls.confirmpassword.valid) {
        this.presentToast('Confirme sua senha.');
      }else if (!this.frmSignup.controls.phonenumber.valid) {
        this.presentToast('Digite seu telefone com DDD.');
      }
    }
  }

  openTerms(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalTermsPage', {}, myModalOptions);

    myModal.present();
  }

  openLogin(){
    this.navCtrl.push('SigninPage');
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
