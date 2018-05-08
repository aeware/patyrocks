import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Event, params } from "../../models/event/event.interface";

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

  constructor(public events: Events, public sanitizer : DomSanitizer, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculateServices = this.formBuilder.group({
      attendees: ['', Validators.required]
    });

    this.event.valueTotal = 0;
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

    this.authServices.postData({}, "products_services").then((result) => {
      localStorage.set
      this.responseData = result;

      if(this.responseData.success){
        this.event.items = [];
        this.responseData.matrix.forEach(element => {
          let a: params = {
            product_id : element['product_id'],
            name : element['name'],
            title_pop : 'Serviço de '+element['name'],
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
          this.frmCalculateServices.addControl(item.tag, new FormControl(true));
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
      if(this.event.attendees > 0)
        return true
      else{
        this.events.publish('alerts:toast','Selecione a quantidade de pessoas.');
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
      return chain.tag === findTo;
    })[0];
  }

  setQtd(product_id){
    this.event.valueTotal = 0;
    if(this.event.attendees != 0){
    
      this.event.items.forEach(b => {
        if(b.qty || b.qty == 1)
        {
          this.event.valueTotal += parseInt(b.vector['a'+this.event.attendees]);
          b.total = parseInt(b.vector['a'+this.event.attendees]);
          b.value = parseInt(b.vector['a'+this.event.attendees]);
        }
        else{
          b.value = b.total = 0;
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
