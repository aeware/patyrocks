import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';

import { Event } from "../../models/event/event.interface";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the CalculatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculate',
  templateUrl: 'calculate.html',
})
export class CalculatePage {

  loading: Loading;
  public account : any;
  public frmCalculate : FormGroup;
  responseData : any;
  event = {} as Event;
  
  constructor(public events: Events, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculate = this.formBuilder.group({
      duration: ['', Validators.required]
    });

    this.event.valorTotal = 0;
    this.event.qtdBartender = 0;
    this.event.qtdGarcom = 0;
    this.event.qtdAjudante = 0;
    this.event.qtdRecepcionista = 0;
    this.event.qtdChurrasqueiro = 0;
    this.event.valTotalBartender = 0;
    this.event.valTotalGarcom = 0;
    this.event.valTotalAjudante = 0;
    this.event.valTotalRecepcionista = 0;
    this.event.valTotalChurrasqueiro = 0;
    this.event.valBartender = 0;
    this.event.valGarcom = 0;
    this.event.valAjudante = 0;
    this.event.valRecepcionista = 0;
    this.event.valChurrasqueiro = 0;

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

    this.authServices.postData({duration : this.event.duration}, "staff_types").then((result) => {
        localStorage.set
        this.responseData = result;
        
        if(this.responseData.success){
        
          this.responseData.types.forEach(element => {
            switch (element.tag) {
              case 'bartender':
                this.event.valBartender = element.value;
                break;
              case 'hostess':
                this.event.valRecepcionista = element.value;
                break; 
              case 'waiter':
                this.event.valGarcom = element.value;
                break;
              case 'helper':
                this.event.valAjudante = element.value;
              case 'bbq':
                this.event.valChurrasqueiro = element.value;
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
    var a = this.event.qtdBartender + this.event.qtdGarcom + this.event.qtdAjudante + this.event.qtdRecepcionista + this.event.qtdChurrasqueiro;
    if(a > 0)
      return true;
    else
      return false;
  }

  calculaValor(){
    this.event.valTotalBartender = this.event.valBartender *  this.event.qtdBartender;
    this.event.valTotalGarcom = this.event.valGarcom *  this.event.qtdGarcom;
    this.event.valTotalAjudante = this.event.valAjudante *  this.event.qtdAjudante;
    this.event.valTotalRecepcionista = this.event.valRecepcionista *  this.event.qtdRecepcionista;
    this.event.valTotalChurrasqueiro = this.event.valChurrasqueiro *  this.event.qtdChurrasqueiro;
    
    this.event.valorTotal = this.event.valTotalRecepcionista+this.event.valTotalAjudante+this.event.valTotalGarcom+this.event.valTotalBartender+this.event.valTotalChurrasqueiro;
  }

  setQtdLess(service){
    switch (service) {
      case 'bartender':
        if(this.event.qtdBartender > 0)
          this.event.qtdBartender = this.event.qtdBartender - 1;
        break;
      case 'garcom':
        if(this.event.qtdGarcom > 0)
          this.event.qtdGarcom = this.event.qtdGarcom - 1;
        break;
      case 'ajudante':
        if(this.event.qtdAjudante > 0)
          this.event.qtdAjudante = this.event.qtdAjudante - 1;
        break;
      case 'recepcao':
        if(this.event.qtdRecepcionista > 0)
          this.event.qtdRecepcionista = this.event.qtdRecepcionista - 1;
        break;
      case 'bbq':
        if(this.event.qtdChurrasqueiro > 0)
          this.event.qtdChurrasqueiro = this.event.qtdChurrasqueiro - 1;
        break;
    
      default:
        break;
    }
    this.calculaValor();
  }
  setQtdPlus(service){

    if(!this.event.duration){
      this.events.publish('alerts:toast','Selecione a duração do evento');
    }else{
      switch (service) {
        case 'bartender':
          this.event.qtdBartender = this.event.qtdBartender + 1;
          break;
        case 'garcom':
          this.event.qtdGarcom = this.event.qtdGarcom + 1;
          break;
        case 'ajudante':
          this.event.qtdAjudante = this.event.qtdAjudante + 1;
          break;
        case 'recepcao':
          this.event.qtdRecepcionista = this.event.qtdRecepcionista + 1;
          break;
        case 'bbq':
          this.event.qtdChurrasqueiro = this.event.qtdChurrasqueiro + 1;
          break;
          
        default:
          break;
      }
      this.calculaValor();
    }
  }

  openCheckout(){
    if(this.validaTela()){
      this.editarLocal();
      
    }else{
      this.events.publish('alerts:toast','Selecione ao menos 1 Staff.');
    }
    
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

  openBartenders() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalBartendersPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
  }

  openGarcons() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalGarconsPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
  }
  
  openBbqs() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalChurrasqueirosPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
  }

  openGerais() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalGeraisPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
  }
  
  openRecepcionistas() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalRecepcionistasPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
  }
}
