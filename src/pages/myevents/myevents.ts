import { Component } from '@angular/core';
import { Modal, ModalController, ModalOptions, IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

// import { ModalEventdayPage } from "../modal-eventday/modal-eventday";
// import { ModalEventdetailsPage } from "../modal-eventdetails/modal-eventdetails";
// import { ModalEventreviewPage } from "../modal-eventreview/modal-eventreview";


import { Account } from "../../models/account/account.interface";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
/**
 * Generated class for the MyeventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myevents',
  templateUrl: 'myevents.html',
})
export class MyeventsPage {

  loading: Loading;
  account = {} as Account;
  public userDetails: any;
  public myevents: any; 
  public myevent: any;
  responseData: any;

  constructor(public loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();
    
    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;

    this.authServices.postData({uuid : this.userDetails.uuid}, "events").then((result) => {
      localStorage.set
      this.responseData = result;

      if(this.responseData.success){
        this.myevents = this.responseData.events;
        this.loading.dismiss();
      }
    }, (err) => {
      console.log(JSON.stringify(err));
      this.loading.dismiss();
    });
  }
  
  openEvent(item){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myevent = item;

    var date = item.dateStart;
    var varDate = new Date(date);
    var today = new Date();

    varDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    var page:string;
    if(varDate > today) {
      page = 'ModalEventdetailsPage';
    }else if(varDate < today){
      page = 'ModalEventreviewPage';
    }else {
      page = 'ModalEventdayPage';
    }
    console.log(page);
    const myModal: Modal = this.modal.create(page, { data: this.myevent }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
      this.loading = this.loadingCtrl.create({
        spinner: 'show',
        content: 'Carregando...'
      });
      this.loading.present();  
      
      this.authServices.postData({uuid : this.userDetails.uuid}, "events").then((result) => {
        localStorage.set
        this.responseData = result;
        console.log(JSON.stringify(this.responseData));
        if(this.responseData.success){
          this.myevents = this.responseData.events;
          this.loading.dismiss();
        }
      }, (err) => {
        this.loading.dismiss();
      });
    });
  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyeventsPage');
  }

}
