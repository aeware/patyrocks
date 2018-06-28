import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Modal, ModalController, ModalOptions, AlertController, IonicPage, NavController, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account";
import { Event } from "../../models/event/event";
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

  public frmRegEdit : FormGroup;
  public responseData : any;
  public register = {
    uuid: '',
    phonenumber: '',
    iagree: false
  }

  constructor(public events: Events, public event: Event, public account: Account, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public toast: ToastController, public afAuth:AngularFireAuth, public authServices: AuthServicesProvider, public alertCtrl: AlertController, private modal: ModalController, public navCtrl : NavController) {
    this.frmRegEdit = this.formBuilder.group({
      iagree: ['', Validators.required],
      phonenumber:  ['', Validators.required]
    });
  }

  singEdit(){
    if(this.frmRegEdit.valid){

      this.register.uuid = this.account.uuid;
      if(this.register.iagree){
        this.events.publish('user:reg_others',this.register);
      }else{
        this.events.publish('alerts:toast', 'Esta de acordo com os termos e condições? Então clique na caixa para continuar.');
      }
    }else{
      if (!this.frmRegEdit.controls.phonenumber.valid) {
        this.events.publish('alerts:toast', 'Digite seu telefone com DDD.');
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

  goBack(){
    this.navCtrl.setRoot('HomePage');
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
