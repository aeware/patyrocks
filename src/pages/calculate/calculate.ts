import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Event, params } from "../../models/event/event.interface";

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
  public hours: any;
  
  constructor(public events: Events, public sanitizer : DomSanitizer, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculate = this.formBuilder.group({
      duration: ['', Validators.required]
    });

    this.event.valueTotal = 0;
    this.event.duration = 0;

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

    this.authServices.postData({}, "products_staffs").then((result) => {
      localStorage.set
      this.responseData = result;
      console.log(this.responseData);
      if(this.responseData.success){
        this.event.items = [];
        this.responseData.matrix.forEach(element => {
          let a: params = {
            product_id : element['product_id'],
            name : element['name'],
            title_pop : 'Equipe de '+element['name'],
            tag : element['tag'],
            image : element['image'],
            description : element['description'],
            vector : element,
            qty: 0,
            value: 0,
            total: 0
          };
          //if(element['image']){
            this.sanitizer.bypassSecurityTrustUrl(a.image);
          //}

          this.event.items.push(a);          
        });
        
        this.event.items.forEach(item => {
          this.frmCalculate.addControl(item.tag, new FormControl(true));
        });
        
        this.loading.dismiss();
      }else{
        this.loading.dismiss();
      }
    }, (err) => {
      this.loading.dismiss();
    });
  }

  validaTela(){
    var a = 0;
    this.event.items.forEach(element => {
      if(element.qty > 0)
        a++;
    });
    if(a > 0){
      if(this.event.duration > 0)
        return true
      else{
        this.events.publish('alerts:toast','Selecione a duração do seu evento.');
        return false
      }
    }
    else{
      this.events.publish('alerts:toast','Selecione pelo menos um staff.');
      return false;
    }
  }

  findValInArray(array, findTo){
    return array.filter(function (chain) {
      return chain.tag === findTo;
    })[0];
  }

  setQtd(product_id, type){

      if(product_id && type != 'duration'){
        var a = this.findValInArray(this.event.items, product_id);
        
        if(type == 'plus')
          a.qty++;
        else if(type == 'less')
          if(a.qty > 0)
            a.qty--;
        if(a.vector['a'+this.event.duration]){
          a.value = a.vector['a'+this.event.duration];
          a.total = (a.vector['a'+this.event.duration] * a.qty);
        }
        else
          a.value = a.total = 0;  
      }
      
      this.event.valueTotal = 0;
      if(this.event.duration > 0){
      
        this.event.items.forEach(b => {
          if(b.qty > 0)
          {
            this.event.valueTotal += (parseInt(b.vector['a'+this.event.duration]) * b.qty);
          }
        });
      }
  }

  openCheckout(){
    if(this.validaTela())
      this.editarLocal();
  }

  editarLocal(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalDetailsPage', { data : this.event, attendees: true}, myModalOptions);
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

    console.log(this.event);
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

  openModal(data){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalProductsPage', { data: data }, myModalOptions);

    myModal.present();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}
