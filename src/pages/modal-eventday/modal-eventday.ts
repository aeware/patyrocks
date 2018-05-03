import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController, NavParams, AlertController, LoadingController, Loading, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
/**
 * Generated class for the ModalEventdayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-eventday',
  templateUrl: 'modal-eventday.html',
})
export class ModalEventdayPage {

  loading: Loading;
  public staff:any;
  public myevent:any;
  public responseData:any;
  public mystaffs:any;

  //  = {
  //   name: 'Eduardo Madeira',
  //   type: 'Bartender',
  //   value: '200,00',
  //   uid: 'asdasda-asdasdasd-dasdasdasdasd-asdasdasd',
  //   euid: '',
  //   showPayed: false,
  //   showArrived: true
  // }

  constructor(public events: Events, public loadingCtrl:LoadingController, public navCtrl: NavController, private alertCtrl: AlertController, private authServices: AuthServicesProvider, private view: ViewController, public params: NavParams) {
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
  

  chegou(staff){
    let alert = this.alertCtrl.create({
      title: 'Confirmar chegada',
      message: 'Você confirma que o '+staff.firstname+' já chegou?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.loading = this.loadingCtrl.create({
              spinner: 'show',
              content: 'Carregando...'
            });
            this.loading.present();
            this.authServices.postData({name: this.myevent.user.firstname, suid: staff.uuid, esuid : staff.esuid}, "staff_arrive").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                staff.arrived = 1;
                staff.payed = 0;
                this.loading.dismiss();
                
              }
            }, (err) => {
              this.loading.dismiss();
            });
          }
        }
      ]
    });
    alert.present();
  }

  pago(staff){
    let alert = this.alertCtrl.create({
      title: 'Confirmar pagamento',
      message: 'Você confirma que realizou o pagamento para '+staff.firstname+'?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.loading = this.loadingCtrl.create({
              spinner: 'show',
              content: 'Carregando...'
            });
            this.loading.present();
            this.authServices.postData({name: this.myevent.user.firstname, suid: staff.uuid, esuid : staff.esuid}, "staff_payed").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                staff.arrived = 1;
                staff.payed = 1;
                this.loading.dismiss();
                
              }
            }, (err) => {
              this.loading.dismiss();
            });
          }
        }
      ]
    });
    alert.present();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}