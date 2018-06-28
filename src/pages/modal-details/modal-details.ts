import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';

import { Event } from "../../models/event/event";
import { Shopping } from "../../models/shopping/shopping";
import { Account } from "../../models/account/account";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
/**
 * Generated class for the ModalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-details',
  templateUrl: 'modal-details.html',
})
export class ModalDetailsPage {

  loading: Loading;
  public eventTypes: any;
  public msg: string;
  public frmDetalhes : FormGroup;
  responseData : any;
  eventDetails : any;

  constructor(public events: Events, public event: Event, public account: Account, public shopp: Shopping, private view: ViewController, public authServices: AuthServicesProvider, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController, public toast: ToastController, public params: NavParams) {
    this.frmDetalhes = this.formBuilder.group({
      complement: ['', Validators.required], 
      location: ['', Validators.required],
      type: ['', Validators.required],
      attendees: ['', Validators.required],
      timeStarts: ['', Validators.required],
      dateStart: ['', Validators.required],
      duration: ['', Validators.required],
      auid: [''],
      number: [''],
      street: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: [''],
      lat: [''],
      lng: [''],
      zipcode: ['']
    });
    if(this.shopp.shopping_uid == "N")
      this.navCtrl.setRoot('HomePage');

    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();

    this.authServices.getData("event_types").then((result) => {
      localStorage.set
      this.responseData = result;
      
      if(this.responseData.success){
        this.eventTypes = this.responseData.types;

        this.authServices.postData({},"message/services").then((result) => {
          localStorage.set
          this.responseData = result;
          
          this.msg = this.responseData.msg;
          this.loading.dismiss();
          
        }, (err) => {
          this.loading.dismiss();
    
        });
      }
    }, (err) => {
      this.loading.dismiss();
    });
  }

  finalizar() {
    var date = this.event.dateStart;
    var varDate = new Date(date);
    var today = new Date();

    if(this.event.timeStarts){
      varDate.setHours(parseInt(this.event.timeStarts.split(':')[0]),parseInt(this.event.timeStarts.split(':')[1]),0,0);
    }
    
    today.setDate(today.getDate()+2);

    if(this.frmDetalhes.valid){

      if(varDate <= today){
        this.alertHour();
      }else{
        this.events.publish('shopping:checkout', this.event);
      }
    }else{
      if(varDate <= today){
        this.alertHour();
      }else if (!this.frmDetalhes.controls.dateStart.valid) {
        this.presentToast('Selecione a data.');
      }else if (!this.frmDetalhes.controls.timeStarts.valid) {
        this.presentToast('Selecione a hora.');
      }else if (!this.frmDetalhes.controls.duration.valid) {
        this.presentToast('Selecione a duração.');
      }else if (!this.frmDetalhes.controls.attendees.valid && this.event.attendees > 0) {
        this.presentToast('Digite número de participantes.');
      }else if (!this.frmDetalhes.controls.type.valid) {
        this.presentToast('Selecione o tipo do evento.');
      }else if (!this.frmDetalhes.controls.location.valid) {
        this.presentToast('Digite a localização.');
      }else if (!this.frmDetalhes.controls.complement.valid) {
        this.presentToast('Digite o complemento.');
      }
    }
  }

  alertHour(){
    this.presentToast('Desculpe mas nosso sistema nao recebe solicitação de eventos com menos de 48 horas.\n'+
    'Favor enviar um email para contato@patyrocks.com com sua solicitação para que nossa equipe verifique se conseguimos te atender.\n\n'+
    'Obrigada', 5000);
  }

  openLocation(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalLocationPage', {}, myModalOptions);
      myModal.onDidDismiss(data => {
      if(data){
        this.event.location = data.street +', ' + data.number + ' - ' + data.neighborhood;
        this.event.number = data.number;
        this.event.street = data.street;
        this.event.neighborhood = data.neighborhood;
        this.event.city = data.city;
        this.event.state = data.state;
        this.event.country = data.country;
        this.event.zipcode = data.zipcode;
        this.event.lat = data.lat;
        this.event.lng = data.lng;
      }
    });
    myModal.present();
  }

  presentToast(msg:string, timer:number = 3000) {
    let toast = this.toast.create({
      message: msg,
      duration: timer,
      position: 'top'
    });
    toast.present();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
