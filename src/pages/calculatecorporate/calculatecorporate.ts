import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Event, Item } from "../../models/event/event";
import { Shopping } from "../../models/shopping/shopping";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the CalculateservicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculatecorporate',
  templateUrl: 'calculatecorporate.html',
})
export class CalculateCorporatePage {

  loading: Loading;
  responseData : any;
  public show_scroll_alert: boolean;
  public frmCalculateCorporate : FormGroup;
  public subTotal = 0.0;
  
  constructor(public shopp: Shopping, public event: Event, public events: Events,public sanitizer : DomSanitizer, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculateCorporate = this.formBuilder.group({
      attendees: ['', Validators.required]
    });
    this.show_scroll_alert = false;
    this.event.attendees = 40;

    this.event.items = [];

    this.atualizaCalculos();
  }
 
  atualizaCalculos(){
    this.loading = this.loadingCtrl.create({
     spinner: 'show',
     content: 'Carregando...'
    });
    this.loading.present();

    this.authServices.postData({}, "products_corporates").then((result) => {
      localStorage.set
      this.responseData = result;

      if(this.responseData.success){
        let y = 0;
        this.responseData.matrix.forEach(element => {
          if(element['product_id']){
            let a: Item = {
              product_id : element['product_id'],
              name : element['name'],
              title_pop : 'Serviço de '+element['name'],
              tag : element['tag'],
              type : 'serv',
              image : element['image'],
              image_description : element['image_description'],
              description : element['description'],
              vector : element,
              qty: 0,
              duration: 0,
              attendees: 0,
              value: 0,
              total: 0
            };
            
            this.sanitizer.bypassSecurityTrustUrl(a.image);
              
            this.event.items.push(a);   
            y++;   
          }
        });
        if(y == 0){
          this.loading.dismiss();
          this.events.publish('alerts:otherChannels');
        }else{
          this.event.items.forEach(item => {
            this.frmCalculateCorporate.addControl(item.tag, new FormControl(true));
          });
          
          this.loading.dismiss();
        }
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

  showAlert(){
    this.show_scroll_alert = true;
  }

  setQtd(product_id){
    this.closeAlert();
    this.subTotal = 0.0;
    if(this.event.attendees != 0){
      this.event.items.forEach(b => {
        if(b.qty || b.qty == 1)
        {
          this.subTotal += parseInt(b.vector['a'+this.event.attendees]);
          b.total = parseInt(b.vector['a'+this.event.attendees]);
          b.value = parseInt(b.vector['a'+this.event.attendees]);
          b.attendees = this.event.attendees;
        }
        else{
          b.value = b.total = 0;
        }
      });
    }
      
  }

  closeAlert(){
    this.show_scroll_alert = false;
  }

  openModal(data){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalProductsPage', { data: data }, myModalOptions);

    myModal.present();
  }

  closeModal() {
    this.navCtrl.setRoot('HomePage');
  }

  shopping_cart(){
    this.events.publish('shopping:cart');
  }

  openCheckout(){
    if(this.validaTela()){
      this.events.publish('shopping:add', this.filterAdd(this.event.items));
    }
  }

  filterAdd(array){
    var a = [];
    array.filter(function (chain) {
      if(chain.qty > 0 || chain.qty == true){
        a.push(chain);
      }
    });
    return a;
  }

}
