import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  loading: Loading;

  public responseData: any;
  public eventDetails: any;
  public msg: string;


  constructor(public events: Events, public loadingCtrl: LoadingController, public authServices: AuthServicesProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController ) {
    localStorage.removeItem('empenho');

    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present(); 

    this.authServices.postData({},"message/faq").then((result) => {
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

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
