import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the StaffcontactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staffcontactus',
  templateUrl: 'staffcontactus.html',
})
export class StaffcontactusPage {

  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams) {
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
