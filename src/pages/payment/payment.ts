import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, Events } from 'ionic-angular';

// import { PaymentOkPage } from "../payment-ok/payment-ok";
import { Shopping } from "../../models/shopping/shopping";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  loading: Loading;

  public responseData: any;
  public eventDetails: any;
  public card = {
    name: '',
    cardnumber: '',
    expiration: '',
    code: '',
    euid: ''
  } 
  public msg: string;

  constructor(public shopp: Shopping, public events: Events, public loadingCtrl: LoadingController, public authServices: AuthServicesProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController ) {

    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();

    this.authServices.postData({},"message/pay").then((result) => {
      localStorage.set
      this.responseData = result;
      
      this.msg = this.responseData.msg;
      this.loading.dismiss();
      
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
  }

  goBack(){
    this.navCtrl.setRoot('MyeventsPage');
  }
 

  pay(){
    this.events.publish('shopping:pay', this.card);
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
