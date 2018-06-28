import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, Events, AlertController } from 'ionic-angular';

import { Account } from "../../models/account/account";

import { Shopping } from "../../models/shopping/shopping";
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
  @ViewChild('btnBuffet') btnBuffet: any;
  @ViewChild('btnEquipes') btnEquipes: any;
  @ViewChild('btnGelo') btnGelo: any;
  @ViewChild('btnDicas') btnDicas: any;
  @ViewChild('btnProdutos') btnProdutos: any;
  @ViewChild('btnKits') btnKits: any;
  @ViewChild('btnCorporate') btnCorporate: any;
  @ViewChild('row1') row1: any;
  @ViewChild('row2') row2: any;
  @ViewChild('row3') row3: any;

  constructor(public platform: Platform, public shopp: Shopping, public account: Account, public events: Events, public alertCtrl: AlertController, private navCtrl : NavController ) {

    platform.ready().then((readySource) => {
      // console.log('Width: ' + platform.width());
      // console.log('Height: ' + platform.height());
      let calc = (platform.width() - 50)/3;
      if(calc > 300)
        calc = 300;
      this.resize(calc);
    });
  }

  resize(size) {
    this.btnBuffet.nativeElement.style.height = this.btnBuffet.nativeElement.style.width = size +  'px';
    this.btnEquipes.nativeElement.style.height = this.btnEquipes.nativeElement.style.width = size +  'px';
    this.btnGelo.nativeElement.style.height = this.btnGelo.nativeElement.style.width = size +  'px';
    this.btnProdutos.nativeElement.style.height = this.btnProdutos.nativeElement.style.width = size +  'px';
    this.btnKits.nativeElement.style.height = this.btnKits.nativeElement.style.width = size +  'px';
    this.btnCorporate.nativeElement.style.height = this.btnCorporate.nativeElement.style.width = size +  'px';

    let a = size - (size/4);
    this.btnDicas.nativeElement.style.height = this.btnDicas.nativeElement.style.width = a +  'px';
 
    this.row1.nativeElement.style.height = size +  'px';
    this.row2.nativeElement.style.height = size +  'px';
    this.row3.nativeElement.style.height = size +  'px';
  }

  openStaffs(){
    this.navCtrl.setRoot('CalculatePage');
  }

  openKits(){
    this.navCtrl.setRoot('CalculateKitsPage');
  }

  openCorporate(){
    this.navCtrl.setRoot('CalculateCorporatePage');
  }
  
  openBuffets(){
    this.navCtrl.setRoot('CalculateServicesPage');
  }

  openProducts(){
    this.navCtrl.setRoot('CalculateProductsPage');
  }

  openDicas(){
    this.navCtrl.push('ModalConsiderationsPage');
  }
  
  shopping_cart(){
    this.events.publish('shopping:cart');
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
  

  

}
