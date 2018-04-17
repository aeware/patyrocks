import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController } from 'ionic-angular';
 
// import { EmpenhoPage } from "../empenho/empenho";

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-churrasqueiros',
  templateUrl: 'modal-churrasqueiros.html',
})
export class ModalChurrasqueirosPage {

  constructor(private view: ViewController, private navCtrl : NavController) {
  }


  closeModal() {
    const data = {
      // name: 'John Doe',
      // occupation: 'Milkman'
    };
    this.view.dismiss(data);
  }
  
  openEmpenho() {
    this.view.dismiss();
    this.navCtrl.setRoot('EmpenhoPage');
  }
}