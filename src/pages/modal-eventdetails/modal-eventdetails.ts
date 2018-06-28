import { Component } from '@angular/core';
import { Modal, ModalController, NavController, ModalOptions, IonicPage, ViewController, NavParams, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

// import { ModalConsiderationsPage } from "../modal-considerations/modal-considerations";
// import { MyeventsPage } from '../myevents/myevents';
/**
 * Generated class for the ModalEventdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-eventdetails',
  templateUrl: 'modal-eventdetails.html',
})
export class ModalEventdetailsPage {

  public myservices: any;
  public myevent: any;
  
  constructor(public events: Events, public sanitizer : DomSanitizer, public navCtrl: NavController, private view: ViewController, private modal: ModalController, public params: NavParams) {
    this.myevent = params.get('data');
    this.myservices = this.myevent.items;
    this.myservices.forEach(element => {
      this.sanitizer.bypassSecurityTrustUrl(element.image_description);
    });
  }

  closeModal() {
    this.view.dismiss();
  }
  
  openConsiderations(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalConsiderationsPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }

  cancelarEvento(shopping_uid){
    this.events.publish('shopping:cancel', shopping_uid, this.view);
  }

  load_shopp(shopping_uid){
    this.events.publish('shopping:load_shopp', shopping_uid, this.view);
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
