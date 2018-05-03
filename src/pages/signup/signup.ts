import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Modal, ModalController, ModalOptions, IonicPage, Events, NavController } from 'ionic-angular';

import { AuthServicesProvider } from '../../providers/auth-services/auth-services';
import { AngularFireAuth } from "angularfire2/auth"; 

import { Account } from "../../models/account/account.interface";
import { Event } from "../../models/event/event.interface";
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
 
  account = {} as Account;
  event = {} as Event;

  public frmSignup : FormGroup;
  public responseData : any;
  public responseData2 : any;
  public responseData3 : any;
  public register = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    phonenumber: '',
    iagree: false
  }

  constructor(public events: Events, private formBuilder:FormBuilder, public afAuth:AngularFireAuth, public authServices: AuthServicesProvider, private modal: ModalController, public navCtrl : NavController) {
    this.frmSignup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      iagree: ['', Validators.required],
      phonenumber:  ['', Validators.required]
    });
  }

  async singUp(){
    if(this.frmSignup.valid){

      if(this.register.iagree){
        this.events.publish('user:signup', this.register);
      }else{
        this.events.publish('alerts:toast','Esta de acordo com os termos e condições? Então clique na caixa para continuar.');
      }
    }else{
      if (!this.frmSignup.controls.firstname.valid) {
        this.events.publish('alerts:toast','Digite seu primeiro nome.');
      }else if (!this.frmSignup.controls.lastname.valid) {
        this.events.publish('alerts:toast','Digite seu último nome.');
      }else if (!this.frmSignup.controls.email.valid) {
        this.events.publish('alerts:toast','Digite seu email.');
      }else if (!this.frmSignup.controls.password.valid) {
        this.events.publish('alerts:toast','Digite sua senha.');
      }else if (!this.frmSignup.controls.confirmpassword.valid) {
        this.events.publish('alerts:toast','Confirme sua senha.');
      }else if (!this.frmSignup.controls.phonenumber.valid) {
        this.events.publish('alerts:toast','Digite seu telefone com DDD.');
      }
    }
  }

  openTerms(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ModalTermsPage', {}, myModalOptions);

    myModal.present();
  }

  openLogin(){
    this.navCtrl.push('SigninPage');
  }

  faleCom(){
    this.events.publish('alerts:contactUs');
  }
}
