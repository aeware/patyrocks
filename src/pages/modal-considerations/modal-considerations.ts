import { Component } from '@angular/core';
import { IonicPage, ViewController, Events } from 'ionic-angular';

/**
 * Generated class for the ModalConsiderationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-considerations',
  templateUrl: 'modal-considerations.html',
})
export class ModalConsiderationsPage {

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
