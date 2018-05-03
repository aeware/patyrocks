import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';

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

  @ViewChild(Content) content: Content;
  loading: Loading;
  public account : any;
  public matrix_attendees : any;
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
    this.event.qtdAguaCerveja = 0;
    this.event.qtdCerveja = 0;
    this.event.qtdGin = 0;
    this.event.valTotalBurguer = 0;
    this.event.valTotalPizza = 0;
    this.event.valTotalCrepe = 0;
    this.event.valTotalAgua = 0;
    this.event.valTotalCerveja = 0;
    this.event.valTotalAguaCerveja = 0;
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

    this.atualizaCalculos();
    
  }

  atualizaCalculos(){
    this.loading = this.loadingCtrl.create({
     spinner: 'show',
     content: 'Carregando...'
   });
   this.loading.present();

   this.authServices.postData({}, "products_attendees").then((result) => {
      localStorage.set
      this.responseData = result;
      
      if(this.responseData.success){
        this.matrix_attendees = this.responseData.matrix;
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
    if(a > 0){
      if(this.event.attendees > 0)
        return true
      else{
        this.events.publish('alerts:toast','Selecione a quantidade de pessoas.');
        this.content.scrollToBottom(0);
        return false
      }
    }
    else{
      this.events.publish('alerts:toast','Selecione ao menos 1 Serviço.');

      return false;
    }
  }

  findValInArray(array, findTo){
    return array.filter(function (chain) {
      return chain.product_id === findTo;
    })[0];
  }

  setQtd(){
    if(this.event.attendees == 0){
      this.event.valorTotal = this.event.valTotalBurguer = this.event.valTotalPizza = this.event.valTotalCrepe = this.event.valTotalAgua = this.event.valTotalCerveja = this.event.valTotalGin = this.event.valTotalAguaCerveja = 0;
    }else{
      if(this.event.qtdBurguer){
        this.event.qtdBurguer = 1;
        var r6 = this.findValInArray(this.matrix_attendees, "6");
        if(r6['v'+this.event.attendees])
          this.event.valTotalBurguer = this.event.valBurguer = parseInt(r6['v'+this.event.attendees]);
      }
      else{
        this.event.valTotalBurguer = this.event.valBurguer = this.event.qtdBurguer = 0;
      }

      if(this.event.qtdPizza){
        this.event.qtdPizza = 1;
        var r7 = this.findValInArray(this.matrix_attendees, "7");
        if( r7['v'+this.event.attendees])
          this.event.valTotalPizza = this.event.valPizza = parseInt(r7['v'+this.event.attendees]);
      }
      else{
        this.event.valTotalPizza = this.event.valPizza = this.event.qtdPizza = 0;
      }

      if(this.event.qtdCrepe){
        this.event.qtdCrepe = 1;
        var r8 = this.findValInArray(this.matrix_attendees, "8");
        if( r8['v'+this.event.attendees])
          this.event.valTotalCrepe = this.event.valCrepe = parseInt(r8['v'+this.event.attendees]);
      }
      else{
        this.event.valTotalCrepe = this.event.valCrepe = this.event.qtdCrepe = 0;
      }

      if(this.event.qtdCerveja > 0 && this.event.qtdAgua > 0){
        this.event.valTotalAgua = this.event.valAgua = 0;
        this.event.valTotalCerveja = this.event.valCerveja = 0;

        this.event.qtdAguaCerveja = 1;
        var r19 = this.findValInArray(this.matrix_attendees, "19");
        if(r19['v'+this.event.attendees])
          this.event.valTotalAguaCerveja = this.event.valAguaCerveja = parseInt(r19['v'+this.event.attendees]);
      }else{
        this.event.valTotalAguaCerveja = this.event.valAguaCerveja = 0;
        
        if(this.event.qtdAgua){
          this.event.qtdAgua = 1;
          var r9 = this.findValInArray(this.matrix_attendees, "9");
          if(r9['v'+this.event.attendees])
            this.event.valTotalAgua = this.event.valAgua = parseInt(r9['v'+this.event.attendees]);
        }
        else{
          this.event.valTotalAgua = this.event.valAgua = this.event.qtdAgua = 0;
        }

        if(this.event.qtdCerveja){
          this.event.qtdCerveja = 1;
          var r10 = this.findValInArray(this.matrix_attendees, "10");
          if(r10['v'+this.event.attendees])
            this.event.valTotalCerveja = this.event.valCerveja = parseInt(r10['v'+this.event.attendees]);
        }
        else{
          this.event.valTotalCerveja = this.event.valCerveja = this.event.qtdCerveja = 0;
        }

      }

      if(this.event.qtdGin){
        this.event.qtdGin = 1;
        var r12 = this.findValInArray(this.matrix_attendees, "11");
        if(r12['v'+this.event.attendees])
          this.event.valTotalGin = this.event.valGin = parseInt(r12['v'+this.event.attendees]);
      }
      else{
        this.event.valTotalGin = this.event.valGin = this.event.qtdGin = 0;
      }
    }
    
    this.event.valorTotal = this.event.valTotalBurguer+this.event.valTotalPizza+this.event.valTotalCrepe+this.event.valTotalAgua+this.event.valTotalCerveja+this.event.valTotalGin+this.event.valTotalAguaCerveja;
    //this.updateValue();
  }

  openCheckout(){
    if(this.validaTela()){
      this.editarLocal();      
    }
  }


  editarLocal(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalDetailsPage', { data : this.event, attendees: false}, myModalOptions);
      myModal.onDidDismiss(data => {
      if(!data.return){
        this.checkout();
      }else{
        this.events.publish('alerts:toast','Confirme os detalhes na tela anterior para continuar.');
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

  openBurguer(){
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalBurguersPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }
  
  openPizza(){
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalPizzasPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();
    
  }

  openCrepe(){
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalCrepesPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }
  
  openGin(){
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalGinPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }
  
  openCerveja(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalCervejasPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }
  
  openAeR(){
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalAerPage', { /*data: myModalData*/ }, myModalOptions);

    myModal.present();

  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
