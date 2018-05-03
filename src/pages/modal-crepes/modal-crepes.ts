import { Component } from '@angular/core';
import { IonicPage, ViewController, Events } from 'ionic-angular';

// import { EmpenhoPage } from "../empenho/empenho";

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-crepes',
  templateUrl: 'modal-crepes.html',
}) 
export class ModalCrepesPage {

  constructor(public events: Events, private view: ViewController) {
    
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