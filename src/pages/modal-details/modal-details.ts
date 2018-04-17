import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions } from 'ionic-angular';

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

  public serviceTypes: any;
  loading: Loading;
  public frmDetalhes : FormGroup;
  public userDetails: any;  
  responseData : any;
  eventDetails : any;
  public event = {
    uid:'',
    dateStart: '',
    timeStarts: '',
    duration: '',
    location: '',
    zipcode: '',
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
    uuid:'',
    number: '',
    qtdBartender: 0,
    qtdGarcom: 0,
    qtdAjudante: 0,
    qtdRecepcionista: 0,
    qtdChurrasqueiro: 0,
    valTotalBartender: 0,
    valTotalGarcom: 0,
    valTotalAjudante: 0,
    valTotalRecepcionista: 0,
    valTotalChurrasqueiro: 0,
    valBartender: 0,
    valGarcom: 0,
    valAjudante: 0,
    valRecepcionista: 0,
    valChurrasqueiro: 0,
    valorTotal: 0
  }

  constructor(private view: ViewController, public authServices: AuthServicesProvider, private loadingCtrl: LoadingController, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController, public toast: ToastController, public params: NavParams) {
    this.frmDetalhes = this.formBuilder.group({
      complement: [''], 
      location: ['', Validators.required],
      type: ['', Validators.required],
      attendees: ['', Validators.required],
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

    this.event = params.get('data');
    console.log(JSON.stringify(this.event));
    
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
  
        if(this.userDetails){
          this.event.uuid = this.userDetails.uuid; 
        }

        this.view.dismiss(this.event);
        
      }
    }else{
      if(varDate <= today){
        this.alertHour();
      }else if (!this.frmDetalhes.controls.dateStart.valid) {
        this.presentToast('Selecione a data.');
      }else if (!this.frmDetalhes.controls.timeStarts.valid) {
        this.presentToast('Selecione a hora.');
      }else if (!this.frmDetalhes.controls.attendees.valid) {
        this.presentToast('Digite número de participantes.');
      }else if (!this.frmDetalhes.controls.type.valid) {
        this.presentToast('Selecione o tipo do evento.');
      }else if (!this.frmDetalhes.controls.location.valid) {
        this.presentToast('Digite a localização.');
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalDetailsPage');
  }

}
