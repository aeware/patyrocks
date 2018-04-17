import { Component } from '@angular/core';
import { Modal, ModalController, ModalOptions, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { Account } from "../../models/account/account.interface";
/**
 * Generated class for the StaffeventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staffevents',
  templateUrl: 'staffevents.html',
})
export class StaffeventsPage {

  loading: Loading;

  account = {} as Account;


  public dia = this.tratamentoDia();
  public userDetails: any;
  public myevents: any;
  responseData: any;

  constructor(private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.carregaTela();
  }

  carregaTela(){
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();
    
    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;
    
    this.authServices.postData({uuid : this.userDetails.uuid}, "staff_confirmed").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        this.myevents = this.responseData.events;
        this.loading.dismiss();
      }
    }, (err) => {

    });
  }
  
  openEvent(_myevent){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    const myModal: Modal = this.modal.create('ModalStaffeventdetailsPage', { data: _myevent }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss((data) => {
      this.carregaTela();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffeventsPage');
  }

  public tratamentoDia(){
    var d = new Date();
    var hour = d.getHours();
    if(hour < 5)
    {
      return "Boa Noite";
    }
    else if(hour < 8)
    {
      return "Boa Madrugada";
    }
    else if(hour < 12)
    {
      return "Bom Dia";
    }
    else if(hour < 18)
    {
      return "Boa Tarde";
    }
    else if(hour < 24)
    {
      return "Boa Noite";
    }
    else
    {
      return "Bom Dia";
    }
  
  }

}
