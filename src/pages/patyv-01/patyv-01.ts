import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { AuthServicesProvider } from '../../providers/auth-services/auth-services';

import { Paty_ai } from "../../models/patyai/patyai";
import { Account } from "../../models/account/account";
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
    answer: '',
    chat: ''
  }
  responseData : any;

  constructor(public pAI: Paty_ai, public account: Account, public navCtrl: NavController, public navParams: NavParams, public authServices: AuthServicesProvider) {
    
    this.pAI.uid = "";
    this.pAI.user_uid = this.account.uuid;
    this.pAI.current_question = 0;
    this.pAI.choosed = false;   
    
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
    if(this.ai.answer){
      this.ai.chat += '<p class="user_answer">'+this.ai.answer+'</p><div class="clear"></div>';
      this.paty_ai_question();
    }
  }

  paty_ai_question(){
    this.thinking();
    
    this.authServices.postData({pAI: this.pAI, answer: this.ai.answer, chat: this.ai.chat}, "paty_answer").then((result) => {
      localStorage.set
      this.responseData = result;

      if(this.responseData.success){
        this.ai.answer = '';
        this.rm_thinking();
 
        this.pAI.uid = this.responseData.chat_uid;
        this.pAI.current_question = this.responseData.question.id;
        let _msg = '';
        if(this.responseData.exclamation){
          _msg = this.responseData.exclamation + '<br/><br/>';
        }
        _msg += this.responseData.question.question;
        
        if(this.responseData.possibilities){
          _msg += '<br/><br/>' + this.responseData.possibilities;
        }
        

        this.paty_talks(_msg);
        if(this.responseData.callback){
          this.paty_ai_question();
        }
      }else{
        this.paty_error();
      }

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
