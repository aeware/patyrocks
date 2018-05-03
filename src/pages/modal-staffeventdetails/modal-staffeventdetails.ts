import { Component } from '@angular/core';
import { Modal, ModalController, NavController, ModalOptions, IonicPage, ViewController, NavParams, AlertController, Events } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
/**
 * Generated class for the ModalStaffeventdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@IonicPage()
@Component({
  selector: 'page-modal-staffeventdetails',
  templateUrl: 'modal-staffeventdetails.html',
})
export class ModalStaffeventdetailsPage {

  public userDetails:any;
  public responseData:any;
  public myevent:any;
  public ioControls={
    isConfirmed:false,
    isReconfirmed:false
  };
  

  constructor(public events: Events, public navCtrl: NavController, private alertCtrl: AlertController, private authServices: AuthServicesProvider, private view: ViewController, private modal: ModalController, public params: NavParams) {
    
    const data = JSON.parse(localStorage.getItem('account'));
    this.userDetails = data;

    this.myevent = params.get('data');
    this.myevent.flags.forEach(element => {
      if(element.tag == 'confirm'){
        this.ioControls.isConfirmed = true;
      }
      if(element.tag == 'reconfirm'){
        this.ioControls.isConfirmed = false;
        this.ioControls.isReconfirmed = true;
      }
    });

    this.myevent.location = this.myevent.location_tiny;

    if(this.ioControls.isConfirmed){
      var d1 = new Date();
      var d2 = new Date(this.myevent.dateStart);

      d2.setHours(d2.getHours() - 24);
      
      if(d1 >= d2){
        this.myevent.location = this.myevent.location_complete;
      }
    }
    
  }
  
  confirmar(item){
    let alert = this.alertCtrl.create({
      title: 'Confirmar participação',
      message: 'Você poderá comparecer ao evento?',
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
            this.authServices.postData({uuid: this.userDetails.uuid, esuid : item.esuid}, "staff_confirm").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                this.view.dismiss(item);
              }
            }, (err) => {
        
            });


          }
        }
      ]
    });
    alert.present();
  }

  negar(item){
    let alert = this.alertCtrl.create({
      title: 'Rejeitar participação',
      message: 'Você deseja rejeitar este evento?',
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

            this.authServices.postData({uuid: this.userDetails.uuid, esuid : item.esuid}, "staff_deny").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                this.view.dismiss(item);
              }
            }, (err) => {
        
            });


          }
        }
      ]
    });
    alert.present();
  }


  reconfirmar(item){
    let alert = this.alertCtrl.create({
      title: 'Confirmar participação',
      message: 'Você realmente poderá comparecer ao evento?',
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
            this.authServices.postData({uuid: this.userDetails.uuid, esuid : item.esuid}, "staff_reconfirm").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                this.view.dismiss(item);
              }
            }, (err) => {
        
            });


          }
        }
      ]
    });
    alert.present();
  }

  renegar(item){
    let alert = this.alertCtrl.create({
      title: 'Cancelar participação',
      message: 'Você deseja cancelar sua ida a este evento?',
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

            this.authServices.postData({uuid: this.userDetails.uuid, esuid : item.esuid}, "staff_redeny").then((result) => {
              localStorage.set
              this.responseData = result;
              
              if(this.responseData.success){
                this.view.dismiss(item);
              }
            }, (err) => {
        
            });


          }
        }
      ]
    });
    alert.present();
  }

  cancel(item){
    let alert = this.alertCtrl.create({
      title: 'Cancelar participação',
      message: 'Você tem certeza que deseja cancelar?',
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
            this.authServices.postData({uuid: this.userDetails.uuid, esuid : item.esuid}, "staff_cancel").then((result) => {
              localStorage.set
              this.responseData = result;
              if(this.responseData.success){
                this.ioControls.isConfirmed = false;
                this.view.dismiss(item);
              }
            }, (err) => {
        
            });


          }
        }
      ]
    });
    alert.present();
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

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
