import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { Paty_ai } from "../../models/patyai/patyai";
/**
 * Generated class for the Patyv_01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patyv-01',
  templateUrl: 'patyv-01.html',
})
export class Patyv_01Page {
  public ai = {
    question: '',
    answer: '',
    chat: ''
  }
  responseData : any;

  constructor(public pAI: Paty_ai,public navCtrl: NavController, public navParams: NavParams, public authServices: AuthServicesProvider) {
    this.paty_ai_question();
  }

  thinking(){
    this.ai.chat += '<p class="paty_ai">...</p><div class="clear"></div>';
  }
  rm_thinking(){
    this.ai.chat = this.ai.chat.replace('<p class="paty_ai">...</p><div class="clear"></div>', '');
  }
  paty_talks(msg){
    this.ai.chat += '<p class="paty_ai">'+msg+'</p><div class="clear"></div>';
  }
  paty_error(){
    this.rm_thinking();
    this.ai.chat += '<p class="paty_ai">Ops! Não entendi sua resposta!</p><div class="clear"></div>';
  }

  send(){
    console.log(this.ai.answer);
    this.ai.chat += '<p class="user_answer">'+this.ai.answer+'</p><div class="clear"></div>';
    this.paty_ai_question();
  }

  paty_ai_question(){
    this.thinking();
    
    this.authServices.postData({chat_uid: this.pAI.uid, user_uid : this.pAI.user_uid, answer: this.ai.answer}, "patyai").then((result) => {
      localStorage.set
      this.responseData = result;

    }, (err) => {
      this.paty_error();
    });
  }

  closeModal() {
    this.navCtrl.setRoot('HomePage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Patyv_01Page');
  }

}
