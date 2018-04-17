import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { Account } from "../../models/account/account.interface";
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  account = {} as Account;

  constructor(private navCtrl : NavController, private alertCtrl: AlertController ) {
  
  }

  openStaffs(){
    this.navCtrl.push('CalculatePage');
  }
  
  openBuffets(){
    let alert = this.alertCtrl.create({
      title: 'Paty Rocks',
      subTitle: 'Como deseja entrar em contato?',
      buttons: [
        {
          text: 'Whatsapp',
          handler: () => {
            window.location.href = 'https://api.whatsapp.com/send?phone=5521965135903&text=Ol%C3%A1%20Paty,%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20buffet';
          }
        },
        {
          text: 'Email',
          handler: () => {
            window.location.href = 'mailto:contato@patyrocks.com';
          }
        },
        {
          text: 'Voltar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();

  }


  

  

}
