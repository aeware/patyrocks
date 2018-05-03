import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, LoadingController, Loading } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
// import { CalculatePage } from "../calculate/calculate";
/**
 * Generated class for the EmpenhoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-empenho',
  templateUrl: 'empenho.html',
})
export class EmpenhoPage {

  loading: Loading;
  public frmEmpenho : FormGroup;
  public userDetails: any;
  responseData: any;
  public serviceTypes: any;
  public event = {
    dateStart: '',
    timeStarts: '',
    duration: '',
    location: '',
    zipcode: '',
    number: '',
    complement: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    attendees: '',
    type: '',
    uuid:''
  }

  constructor(private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, public toast: ToastController, private formBuilder:FormBuilder, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.frmEmpenho = this.formBuilder.group({
      complement: [''],
      location: ['', Validators.required],
      type: ['', Validators.required],
      attendees: ['', Validators.required],
      duration: ['', Validators.required],
      timeStarts: ['', Validators.required],
      dateStart: ['', Validators.required],
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

    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();
    
    this.authServices.getData("service_types").then((result) => {
      localStorage.set
      this.responseData = result;
      
      if(this.responseData.success){
        this.serviceTypes = this.responseData.types;
      }
      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();

    });

    if(localStorage.getItem('account') !== 'undefined'){
      const data = JSON.parse(localStorage.getItem('account'));
      this.userDetails = data;
    }
    
    
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

  openEmpenho() {
    var date = this.event.dateStart;
    var varDate = new Date(date);
    var today = new Date();

    if(this.event.timeStarts){
      varDate.setHours(parseInt(this.event.timeStarts.split(':')[0]),parseInt(this.event.timeStarts.split(':')[1]),0,0);
    }
    
    today.setDate(today.getDate()+2);

    if(this.frmEmpenho.valid){

      if(varDate <= today){
        this.alertHour();
      }else{
        this.loading = this.loadingCtrl.create({
          spinner: 'show',
          content: 'Carregando...'
        });
        this.loading.present();
  
  
        //VALIDAR TODAS AS ENTRADAS
  
        if(this.userDetails){
          this.event.uuid = this.userDetails.uuid; 
        }
        
        this.authServices.postData(this.event, "event").then((result) => {
          localStorage.set
          this.responseData = result;
          
          localStorage.setItem("empenho", JSON.stringify(this.responseData));
  
          this.navCtrl.push('CalculatePage');
          this.loading.dismiss();
  
        }, (err) => {
          
          this.loading.dismiss();
        });
      }
    }else{
      if(varDate <= today){
        this.alertHour();
      }else if (!this.frmEmpenho.controls.dateStart.valid) {
        this.presentToast('Selecione a data.');
      }else if (!this.frmEmpenho.controls.timeStarts.valid) {
        this.presentToast('Selecione a hora.');
      }else if (!this.frmEmpenho.controls.duration.valid) {
        this.presentToast('Selecione a duração.');
      }else if (!this.frmEmpenho.controls.attendees.valid) {
        this.presentToast('Digite número de participantes.');
      }else if (!this.frmEmpenho.controls.type.valid) {
        this.presentToast('Selecione o tipo do evento.');
      }else if (!this.frmEmpenho.controls.location.valid) {
        this.presentToast('Digite a localização.');
      }
    }
  }

  alertHour(){
    this.presentToast('Desculpe mas nosso sistema nao recebe solicitação de eventos com menos de 48 horas.\n'+
    'Favor enviar um email para contato@patyrocks.com com sua solicitação para que nossa equipe verifique se conseguimos te atender.\n\n'+
    'Obrigada', 5000);
  }

  presentToast(msg:string, timer:number = 3000) {
    let toast = this.toast.create({
      message: msg,
      duration: timer,
      position: 'top'
    });
  
    toast.present();
  }
}
