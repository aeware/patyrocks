import { Component } from '@angular/core';
import { Modal, ModalController, NavController, ModalOptions, IonicPage, ViewController, NavParams, AlertController } from 'ionic-angular';

// import { ModalConsiderationsPage } from "../modal-considerations/modal-considerations";
// import { MyeventsPage } from '../myevents/myevents';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
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

  public responseData:any;
  public myservices: any;
  public myevent={
    attendees:'',
    canceled:false,
    canceled_at:'',
    created_at:'',
    dateStart:'',
    duration:'',
    euid:'',
    location_complete:'',
    location_tiny:'',
    services:Array,
    type:'',
    typename:'',
    updated_at:'',
    is_time: false,
    staffs: Array
  };
  public myeventQty = {
    qtdBartender: 0,
    qtdChurrasqueiro: 0,
    qtdRecepcionista: 0,
    qtdGarcom: 0,
    qtdAjudante: 0
  };
  
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private authServices: AuthServicesProvider, private view: ViewController, private modal: ModalController, public params: NavParams) {
    this.myevent = params.get('data');
    this.myservices = this.myevent.services;
    this.myservices.forEach(element => {
      switch (element.staffTypeId) {
        case '1':
          this.myeventQty.qtdBartender = element.quantity;
          break;
        case '2':
          this.myeventQty.qtdGarcom = element.quantity;
          break;
        case '3':
          this.myeventQty.qtdRecepcionista = element.quantity;
          break;
        case '4':
          this.myeventQty.qtdAjudante = element.quantity;
          break;
        case '5':
          this.myeventQty.qtdChurrasqueiro = element.quantity;
          break;
      
        default:
          break;
      }
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

  cancelarEvento(){
    this.authServices.postData({}, "event/"+this.myevent.euid+"/cancel").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        let alert = this.alertCtrl.create({
          title: 'Paty Rocks',
          subTitle: 'Evento cancelado com sucesso!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                  this.navCtrl.push('MyeventsPage');
              }
            }
          ]
        });
        alert.present();
      }
    }, (err) => {
      var retorno = JSON.parse(err._body);

      let alert = this.alertCtrl.create({
        title: 'Paty Rocks',
        subTitle: retorno.status,
        buttons: [
          {
            text: 'OK',
            handler: () => {
                this.navCtrl.push('MyeventsPage');
            }
          }
        ]
      });
      alert.present();
    });

  }

  ionViewDidLoad() {
    
  }

}
