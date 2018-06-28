import { Component } from '@angular/core';
import { Modal, ModalController, ModalOptions, IonicPage, NavController, NavParams, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { Account } from "../../models/account/account";
/**
 * Generated class for the StaffdashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staffdashboard',
  templateUrl: 'staffdashboard.html',
})
export class StaffdashboardPage {

  loading: Loading;

  public userDetails: any;
  public myevents: any;
  responseData: any;

  constructor(public events: Events, public account: Account, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {

    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;

    this.carregaTela();
    
  }

  public dia = this.tratamentoDia();
  
  openEvent(_myevent){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalStaffeventdetailsPage', { data: _myevent }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss((data) => {
      if(data){
        this.carregaTela();
      }

    });
  }
  
  removeItem(array, element) {
    const index = array.indexOf(element);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
  }

  carregaTela(){
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();
    this.authServices.postData({uuid : this.userDetails.uuid}, "staff_invites").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        this.myevents = [];
        this.myevents = this.responseData.events;

        this.loading.dismiss();
      }
    }, (err) => {
        this.loading.dismiss();
    });
  }


  tratamentoDia(){
    var d = new Date();
    var hour = d.getHours();
    if(hour < 5)
    {
      return "Boa Noite";
    }
    else if(hour < 8)
    {
      return "Bom Dia";
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

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
