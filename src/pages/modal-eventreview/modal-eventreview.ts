import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController, NavParams, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

// import { MyeventsPage } from "../myevents/myevents";
/**
 * Generated class for the ModalEventreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-eventreview',
  templateUrl: 'modal-eventreview.html',
})
export class ModalEventreviewPage {
  
  public myservices: any;
  public myevent: any;

  constructor(public events: Events, public sanitizer : DomSanitizer, public navCtrl: NavController, private view: ViewController, public params: NavParams) {
    this.myevent = params.get('data');
    this.myservices = this.myevent.items;
    this.myservices.forEach(element => {
      this.sanitizer.bypassSecurityTrustUrl(element.image_description);
    });
  }
  
  closeModal() {
    const data = {
      // name: 'John Doe',
      // occupation: 'Milkman'
    };
    this.view.dismiss(data);
  }

  enviar(){
    this.events.publish('services:rate', this.myevent, this.view);
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}