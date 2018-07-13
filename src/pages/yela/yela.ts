import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, Modal, ModalController, ModalOptions, Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Event, Item } from "../../models/event/event";
import { Shopping } from "../../models/shopping/shopping";

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

/**
 * Generated class for the yelaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-yela',
  templateUrl: 'yela.html',
})
export class YelaPage {

  loading: Loading;
  
  responseData : any;
  public frmCalculate : FormGroup;
  public hours: any;
  public subTotal = 0.0;
  
  constructor(public shopp: Shopping, public event: Event, public events: Events, public sanitizer : DomSanitizer, private loadingCtrl: LoadingController, public authServices: AuthServicesProvider, private formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams, private modal: ModalController) {
    
    this.frmCalculate = this.formBuilder.group({});
    
    this.event.items = [];

    this.atualizaCalculos();

  }

  atualizaCalculos(){
    this.loading = this.loadingCtrl.create({
     spinner: 'show',
     content: 'Carregando...'
    });
    this.loading.present();

    this.authServices.postData({}, "products_by_brand/yela").then((result) => {
      localStorage.set
      this.responseData = result;
      if(this.responseData.success){
        let y = 0;
        this.responseData.matrix.forEach(element => {
          if(element['product_id']){
            let a: Item = {
              product_id : element['product_id'],
              name : element['name'],
              title_pop : element['name'],
              tag : element['tag'],
              type : 'prod',
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
      return true
    }
    else{
      this.events.publish('alerts:toast','Selecione pelo menos um produto.');
      return false;
    }
  }

  findValInArray(array, findTo){
    return array.filter(function (chain) {
      return chain.tag === findTo;
    })[0];
  }

  setQtd(product_id, type){

      var a = this.findValInArray(this.event.items, product_id);
      
      if(type == 'plus')
        a.qty++;
      else if(type == 'less')
        if(a.qty > 0)
          a.qty--;
      if(a.vector['a1']){
        a.value = a.vector['a1'];
        a.total = (a.vector['a1'] * a.qty);
      }
      else
        a.value = a.total = 0;  
    
        
      this.subTotal = 0;
      
      this.event.items.forEach(b => {
        if(b.qty > 0)
        {
          this.subTotal += (parseInt(b.vector['a1']) * b.qty);
        }
      });
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
