import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Modal, ModalController, ModalOptions, AlertController, IonicPage, NavController, LoadingController, Loading } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account.interface";
import { Event } from "../../models/event/event.interface";
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the OthersDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-others-data',
  templateUrl: 'others-data.html',
})
export class OthersDataPage {

  loading: Loading;
 
  account = {} as Account;
  event = {} as Event;

  public frmRegEdit : FormGroup;
  public eventDetails: any;
  public userDetails: any;
  public responseData : any;
  public responseData2 : any;
  public responseData3 : any;
  public register = {
    uuid: '',
    phonenumber: '',
    iagree: false
  }

  constructor(private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public toast: ToastController, public afAuth:AngularFireAuth, public authServices: AuthServicesProvider, public alertCtrl: AlertController, private modal: ModalController, public navCtrl : NavController) {
    this.frmRegEdit = this.formBuilder.group({
      iagree: ['', Validators.required],
      phonenumber:  ['', Validators.required]
    });

    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;

    if(this.userDetails){
      this.register.uuid = this.userDetails.uuid;
    }
  }

  async singEdit(){
    if(this.frmRegEdit.valid){

      if(this.register.iagree){
        this.loading = this.loadingCtrl.create({
          spinner: 'show',
          content: 'Carregando...'
        });
        this.loading.present();
        
        console.log(JSON.stringify(this.register));
        this.authServices.postData(this.register, "regupdate").then((result) => {
          
          localStorage.set
          this.responseData = result;
          
          this.account.logged = true;
          this.account.isStaff = false;

          this.event = JSON.parse(localStorage.getItem('empenho'));
                    
          if(this.event){
            this.event.uuid = this.responseData2.account.uuid;
              this.authServices.postData({ uuid: this.event.uuid, euid: this.event.uid}, "connect_event").then((result) => {
                localStorage.set
                this.responseData3 = result;
              });
            this.navCtrl.setRoot('PaymentPage');
          }
          else{
            this.navCtrl.setRoot('HomePage');
          }
          this.loading.dismiss();
          this.loading.dismiss();
          
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
      if (!this.frmRegEdit.controls.phonenumber.valid) {
        this.presentToast('Digite seu telefone com DDD.');
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OthersDataPage');
  }

  presentToast(msg:string) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.present();
  }


  openTerms(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalTermsPage', {}, myModalOptions);

    myModal.present();
  }

}
