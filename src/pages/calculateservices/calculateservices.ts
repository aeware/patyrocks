import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';

import { Event } from "../../models/event/event.interface";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the CalculateservicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculateservices',
  templateUrl: 'calculateservices.html',
})
export class CalculateservicesPage {
  
  loading: Loading;
  public account : any;
  public frmCalculateServices : FormGroup;
  responseData : any;
  event = {} as Event;

  constructor(public events: Events, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculateServices = this.formBuilder.group({
      attendees: ['', Validators.required],
      qtdAgua: ['', Validators.required],
      qtdBurguer: ['', Validators.required],
      qtdCerveja: ['', Validators.required],
      qtdCrepe: ['', Validators.required],
      qtdGin: ['', Validators.required],
      qtdPizza: ['', Validators.required]
    });

    this.event.valorTotal = 0;
    this.event.qtdBurguer = 0;
    this.event.qtdPizza = 0;
    this.event.qtdCrepe = 0;
    this.event.qtdAgua = 0;
    this.event.qtdCerveja = 0;
    this.event.qtdGin = 0;
    this.event.valTotalBurguer = 0;
    this.event.valTotalPizza = 0;
    this.event.valTotalCrepe = 0;
    this.event.valTotalAgua = 0;
    this.event.valTotalCerveja = 0;
    this.event.valTotalGin = 0;
    this.event.valBurguer = 0;
    this.event.valPizza = 0;
    this.event.valCrepe = 0;
    this.event.valAgua = 0;
    this.event.valCerveja = 0;
    this.event.valGin = 0;
    this.event.attendees = 0;

    if(localStorage.getItem("account")){
      this.account = JSON.parse(localStorage.getItem('account'));
    }

  }

  atualizaCalculos(){
    this.loading = this.loadingCtrl.create({
     spinner: 'show',
     content: 'Carregando...'
   });
   this.loading.present();

   this.authServices.postData({duration : 4}, "buffet_types").then((result) => {
      localStorage.set
      this.responseData = result;
      
      if(this.responseData.success){
      
        this.responseData.types.forEach(element => {
          switch (element.tag) {
            case 'bgr':
              this.event.valBurguer = element.value;
              break;
            case 'pzz':
              this.event.valPizza = element.value;
              break; 
            case 'crp':
              this.event.valCrepe = element.value;
              break;
            case 'aer':
              this.event.valAgua = element.value;
              break;
            case 'cvj':
              this.event.valCerveja = element.value;
              break;
            case 'gin':
              this.event.valGin = element.value;
              break;
            default:
              break;
          }
        });
        this.calculaValor();
        this.loading.dismiss();
      }else{
        this.loading.dismiss();
      }
    }, (err) => {
      this.loading.dismiss();
    });
  }

  validaTela(){
    var a = this.event.qtdBurguer + this.event.qtdPizza + this.event.qtdCrepe + this.event.qtdAgua + this.event.qtdCerveja + this.event.qtdGin;
    if(a > 0)
      return true;
    else
      return false;
  }

  calculaValor(){
    this.event.valTotalBurguer = this.event.valBurguer *  this.event.attendees;
    this.event.valTotalPizza = this.event.valPizza *  this.event.attendees;
    this.event.valTotalCrepe = this.event.valCrepe *  this.event.attendees;
    this.event.valTotalAgua = this.event.valAgua *  this.event.attendees;
    this.event.valTotalCerveja = this.event.valCerveja *  this.event.attendees;
    this.event.valTotalGin = this.event.valGin *  this.event.attendees;
    
    this.event.valorTotal = this.event.valTotalBurguer+this.event.valTotalPizza+this.event.valTotalCrepe+this.event.valTotalAgua+this.event.valTotalCerveja+this.event.valTotalGin;
  }

  setQtd(service){
    switch (service) {
      case 'bgr':
        if(this.event.qtdBurguer > 0)
          this.event.qtdBurguer = this.event.qtdBurguer - 1;
        else
          this.event.qtdBurguer = this.event.qtdBurguer + 1;
        break;
      case 'pzz':
        if(this.event.qtdPizza > 0)
          this.event.qtdPizza = this.event.qtdPizza - 1;
        else
          this.event.qtdPizza = this.event.qtdPizza + 1;
        break;
      case 'crp':
        if(this.event.qtdCrepe > 0)
          this.event.qtdCrepe = this.event.qtdCrepe - 1;
        else
          this.event.qtdCrepe = this.event.qtdCrepe + 1;
        break;
      case 'aer':
        if(this.event.qtdAgua > 0)
          this.event.qtdAgua = this.event.qtdAgua - 1;
        else
          this.event.qtdAgua = this.event.qtdAgua + 1;
        break;
      case 'cvj':
        if(this.event.qtdCerveja > 0)
          this.event.qtdCerveja = this.event.qtdCerveja - 1;
        else
          this.event.qtdCerveja = this.event.qtdCerveja + 1;
        break;
      case 'gin':
        if(this.event.qtdGin > 0)
          this.event.qtdGin = this.event.qtdGin - 1;
        else
          this.event.qtdGin = this.event.qtdGin + 1;
        break;
    
      default:
        break;
    }
    this.calculaValor();
  }

  teste(total){
    this.event.attendees = total;
    

    //console.log(total);
  }

  scrollPosition(){
    console.log(9);
  }

  openCheckout(){

    console.log(JSON.stringify(this.event));

    // if(this.validaTela()){
    //   this.editarLocal();

    //   // if(this.event.street == ''){
    //   //   this.editarLocal();
    //   // }else{
    //   //   this.checkout();
    //   // }
      
    // }else{
    //   this.events.publish('alerts:toast','Selecione ao menos 1 Serviço.');
    // }
    
  }


  editarLocal(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalDetailsPage', { data : this.event}, myModalOptions);
      myModal.onDidDismiss(data => {
      
      if(data){
        this.checkout();
      }
    });
    myModal.present();
  }

  checkout(){

    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Carregando...'
    });
    this.loading.present();

    localStorage.setItem("empenho", JSON.stringify(this.event));


    if(!localStorage.getItem('empenho')){ 
      this.navCtrl.setRoot('HomePage');
    }
    
    if(localStorage.getItem("account")){
      this.account = JSON.parse(localStorage.getItem('account'));
      this.event.uuid = this.account.uuid;
    }

    this.authServices.postData(this.event, "event").then((result) => {
      localStorage.set
      this.responseData = result;

      this.event.uid = this.responseData.event.euid;

      localStorage.setItem("empenho", JSON.stringify(this.event));

      this.loading.dismiss();

      if(!localStorage.getItem("account")){
        this.navCtrl.setRoot('SigninPage');  
      }else{
        this.navCtrl.setRoot('PaymentPage');
      }
      

    }, (err) => {
      this.loading.dismiss();
      this.events.publish('alerts:toast','Houve um erro na solicitação. Tente novamente.');
    });




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculateservicesPage');
  }

  openBurguer(){

  }
  
  openPizza(){
    
  }

  openCrepe(){

  }
  
  openGin(){

  }
  
  openCerveja(){

  }
  
  openAeR(){

  }

}
