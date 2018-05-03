import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Events } from 'ionic-angular';

// import { HomePage } from "../home/home";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  constructor(public events: Events, public navCtrl: NavController, public authServices: AuthServicesProvider, public alertCtrl: AlertController) {
  }

  public userDetails: any;
  responseData : any;
  public contact = {
    subject: '',
    message: '',
    uuid: ''
  }

  send(){

    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;

    if(this.userDetails){
      this.contact.uuid = this.userDetails.uuid;
    }
 
    this.authServices.postData(this.contact, "contactus").then((result) => {
      
      localStorage.set
      this.responseData = result;
      
      let alert = this.alertCtrl.create({
        title: 'Paty Rocks',
        subTitle: 'Enviado com sucesso!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.contact.subject = '';
              this.contact.message = '';
              this.navCtrl.setRoot('HomePage');
            }
          }
        ]
      });
      alert.present();

    }, (err) => {
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
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
