import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';

declare var google:any;


/**
 * Generated class for the ModalLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-location',
  templateUrl: 'modal-location.html',
})
export class ModalLocationPage {
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  geo = new google.maps.Geocoder();
  ret_event;

  constructor(public events: Events, public navCtrl: NavController, public toast: ToastController, public navParams: NavParams, public view: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.ret_event = {
      zipcode: '',
        number: '',
        complement: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        lng: ''
    }
  }
 
  chooseItem(item: any) {
    let me = this;
    if(typeof item.terms !== 'undefined'){
      if(item.terms.length < 6 && item.terms[0].value.split(',').length < 2){
        this.presentToast('Digite o número do seu endereço.');
      }else{
        if(item.terms.find(this.checkIfRio)){
          this.geo.geocode({'placeId': item.place_id}, function (predictions, status) {
            me.ret_event.lat = predictions[0].geometry.location.lat();
            me.ret_event.lng = predictions[0].geometry.location.lng();

            predictions[0].address_components.forEach(function (addrComps) {
              addrComps.types.forEach(function (res) {
                switch (res) {
                  case "country":
                    me.ret_event.country = addrComps.long_name;
                    break;
                  case "administrative_area_level_1":
                    me.ret_event.state = addrComps.short_name;
                    break;
                  case "administrative_area_level_2":
                    me.ret_event.city = addrComps.long_name;
                    break;
                  case "sublocality_level_1":
                    me.ret_event.neighborhood = addrComps.long_name;
                    break;
                  case "route":
                    me.ret_event.street = addrComps.long_name;
                    break;
                  case "street_number":
                    me.ret_event.number = addrComps.long_name;
                    break;
                  case "postal_code":
                    me.ret_event.zipcode = addrComps.long_name;
                    break;
                
                  default:
                    break;
                }
              });
            });
            me.view.dismiss(me.ret_event);
          });
        }else{
          this.presentToast('Por enquanto só conectamos profissionais no município do Rio de Janeiro, em breve estaremos na sua cidade. Obrigada!');
        }
      }
    }
  }
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    var naoEnc = {
      description: 'Endereço não encontrado'
    }
    let me = this;
    var _rj = new google.maps.LatLng(-22.913885,-43.726179);
    this.service.getPlacePredictions({ radius: 500, location: _rj, input: this.autocomplete.query, componentRestrictions: {country: 'BR'} }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        if(predictions){
          predictions.forEach(function (prediction) {
            me.autocompleteItems.push(prediction);
          });
        }else{
          me.autocompleteItems.push(naoEnc);
        }
      });
    });
  }

  presentToast(msg:string) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.present();
  }

  checkIfRio(item){
    if(item.value == "Rio de Janeiro"){
      return true;
    }else{
      return false;
    }
  }

  closeModal() {
    this.view.dismiss();
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }

}
