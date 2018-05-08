import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController, NavParams, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

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
  
  loading: Loading;
  public staff:any;
  public myevent:any;
  public responseData:any;
  public mystaffs:any;

  constructor(public events: Events, public loadingCtrl:LoadingController, public navCtrl: NavController, private authServices: AuthServicesProvider, private view: ViewController, public params: NavParams) {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();

    this.myevent = params.get('data');
    this.authServices.postData({euid : this.myevent.euid}, "staffs_for_event").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        this.mystaffs = this.responseData.staffs;
        this.loading.dismiss();
      }
    }, (err) => {
      this.loading.dismiss();
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
    let me = this;
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'enviando...'
    });
    var _total = this.mystaffs.length;
    var _cont = 0;

    this.loading.present();
    this.mystaffs.forEach(element => {
      this.authServices.postData({rate: element.rate, uuid: element.uuid, esuid : element.esuid, description: element.description}, "product_rate").then((result) => {
        localStorage.set
        this.responseData = result;
        _cont++;
        if(_cont == _total){
          this.authServices.postData({esuid : element.esuid}, "event_rated").then((result) => {
            localStorage.set
            this.responseData = result;
            me.loading.dismiss();
            this.view.dismiss();
          }, (err) => {
            me.loading.dismiss();
          });
        }
      }, (err) => {
        me.loading.dismiss();
      });
    });
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}