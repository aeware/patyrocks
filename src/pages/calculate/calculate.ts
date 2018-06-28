import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Event, Item } from "../../models/event/event";
import { Shopping } from "../../models/shopping/shopping";

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
  responseData : any;
  public show_scroll_alert:boolean;
  public frmCalculate : FormGroup;
  public hours: any;
  public subTotal = 0.0;
  
  constructor(public shopp: Shopping, public event: Event, public events: Events, public sanitizer : DomSanitizer, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    this.frmCalculate = this.formBuilder.group({
      duration: ['', Validators.required]
    });
    this.show_scroll_alert = false;

    this.event.items = [];
    this.event.duration = 8;

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
      
      if(this.responseData.success){
        let y = 0;
        this.responseData.matrix.forEach(element => {
          if(element['product_id']){
            let a: Item = {
              product_id : element['product_id'],
              name : element['name'],
              title_pop : 'Equipe de '+element['name'],
              tag : element['tag'],
              type : 'equip',
              image : element['image'],
              image_description : element['image_description'],
              description : element['description'],
              vector : element,
              qty: 0,
              duration: this.event.duration,
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
            this.frmCalculate.addControl(item.tag, new FormControl(true));
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

  showAlert(){
    this.show_scroll_alert = true;
  }

  setQtd(product_id, type){
    this.closeAlert();

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
      
      this.subTotal = 0;
      if(this.event.duration > 0){
      
        this.event.items.forEach(b => {
          if(b.qty > 0)
          {
            b.value = b.vector['a'+this.event.duration];
            b.total = (b.vector['a'+this.event.duration] * b.qty);
            this.subTotal += (parseInt(b.vector['a'+this.event.duration]) * b.qty);
            b.duration = this.event.duration;
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
