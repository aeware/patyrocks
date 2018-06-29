import { Component } from '@angular/core';
import { IonicPage, ViewController, AlertController, Events, LoadingController, Loading } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the ModalConsiderationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-considerations',
  templateUrl: 'modal-considerations.html',
})
export class ModalConsiderationsPage {

  loading: Loading;

  public responseData: any;
  public eventDetails: any;
  public msg: string;

  constructor(public events: Events, public authServices: AuthServicesProvider, public loadingCtrl: LoadingController, private view: ViewController, private alertCtrl: AlertController) {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present(); 

    this.authServices.postData({},"message/tips").then((result) => {
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

  closeModal() {
    const data = {
      // name: 'John Doe',
      // occupation: 'Milkman'
    };
    this.view.dismiss(data);
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}
