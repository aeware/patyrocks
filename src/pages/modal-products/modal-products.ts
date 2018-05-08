import { Component } from '@angular/core';
import { IonicPage, ViewController, Events, NavParams } from 'ionic-angular';
 
import { params } from "../../models/event/event.interface";
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

  public item : params;

  constructor(public events: Events, private view: ViewController, public params: NavParams) {

    this.item = params.get('data');
    

  }
  
  closeModal() {
    this.view.dismiss();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}