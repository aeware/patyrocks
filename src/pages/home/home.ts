import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';

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

  constructor(public events: Events, private navCtrl : NavController ) {
  


  }

  openStaffs(){
    this.navCtrl.push('CalculatePage');
  }
  
  openBuffets(){
    this.navCtrl.push('CalculateservicesPage');

  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
  

  

}
