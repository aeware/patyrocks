import { Component } from '@angular/core';
import { IonicPage, ViewController, Events, NavParams } from 'ionic-angular';
 
import { Cart } from "../../models/shopping/shopping";
// import { EmpenhoPage } from "../empenho/empenho";

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-products',
  templateUrl: 'modal-products.html',
})
export class ModalProductsPage {

  public item : Cart;

  constructor(public events: Events, private view: ViewController, public params: NavParams) {

    this.item = params.get('data');
    console.log(this.item);
    
  }
  
  closeModal() {
    this.view.dismiss();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}