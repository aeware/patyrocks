import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, Events, ViewController } from 'ionic-angular';

import { Shopping } from "../../models/shopping/shopping";
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  constructor(public shopp:Shopping, private modal: ModalController, public events: Events,public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    if(!this.shopp.items.length)
      this.goBack();
  }

  goBack(){
    this.navCtrl.setRoot('HomePage');
  }

  remove(index, item){
    this.shopp.items.splice(index, 1);
    this.events.publish('shopping:remove', item, index);

    if(!this.shopp.items.length){
      this.navCtrl.setRoot('HomePage');
    }
  }

  openCheckout(){
    this.events.publish('shopping:checkout_details');
  }
  
  openModal(data){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalProductsPage', { data: data }, myModalOptions);

    myModal.present();
  }
 
  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}
