// import { Injectable } from '@angular/core';

// import { Http, Headers, RequestOptions, Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';

// import { Events, Platform } from 'ionic-angular';

// import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';

// declare var cordova:any;
// declare var window:any;

// @Injectable()
// export class SocialService {

// 	mode:string = 'dev';

// 	ready:boolean = false;
// 	isCordova:boolean;
// 	isIOS:boolean;
// 	isAndroid:boolean;

// 	fbPermissions:any[];

// 	constructor( 
// 		public http:Http,
// 		public events:Events,
// 		public plt:Platform,
// 		public fb:Facebook){

// 		this.isAndroid = plt.is('android');
//     	this.isCordova = plt.is('cordova');
//     	this.isIOS = plt.is('ios');

//     	this.fbPermissions = ['public_profile', 'email'];

//     	let fbInit = ()=>{
//     		window.facebookConnectPlugin.browserInit('138072253579918', '549111bdfa1c347ac4662105ee727652');
//     	}

//     	plt.ready()
//     	.then(source=>{
// 			console.log(source);
// 			console.log('iniciou o provider do fb');

//     		if(this.isCordova){
// 				console.log(window);
//     			if(!window.facebookConnectPlugin){
//     				setTimeout(()=>{
//     					console.log(window.facebookConnectPlugin);
//     					fbInit();
//     				}, 2000);
//     			}else{
//     				console.log(window.facebookConnectPlugin);
//     				fbInit();
//     			}
//     		}else{
//     			console.log(window);
//     			if(!window.facebookConnectPlugin){
//     				setTimeout(()=>{
//     					console.log(window.facebookConnectPlugin);
//     					fbInit();
//     				}, 2000);
//     			}else{
//     				console.log(window.facebookConnectPlugin);
//     				fbInit();
//     			}
//     		}
//     	})
//     	.catch(err=>{

//     	});

		
// 	}

// 	fbLogin():Promise<any>{
// 		if(this.isCordova){
// 			console.log('é cordova 1');
// 			return new Promise((resolve, reject)=>{
// 				console.log('é cordova 2');
// 				window.facebookConnectPlugin.getLoginStatus(
// 				(res)=>{
// 					console.log('é cordova 3');
// 					console.log(res);
// 					if(res.status == 'connected') {
// 						resolve(true);
// 						return;
// 					}else{
// 						window.facebookConnectPlugin.login(this.fbPermissions, 
// 						res=>{
// 							console.log(res);
// 							resolve(true);
// 						},
// 						err=>{
// 							console.log(err);
// 							reject(err);
// 						})
// 					}
// 					//resolve(res);
// 				},
// 				(err)=>{
// 					console.log(err);
// 					reject(err);
// 				});
// 			});
// 		}
// 		else{

// 			return new Promise((resolve, reject)=>{
// 				window.facebookConnectPlugin.getLoginStatus(
// 				(res)=>{
// 					console.log(res);
// 					if(res.status == 'connected') {
// 						resolve(true);
// 						return;
// 					}else{
// 						window.facebookConnectPlugin.login(this.fbPermissions, 
// 						res=>{
// 							console.log(res);
// 							resolve(true);
// 						},
// 						err=>{
// 							console.log(err);
// 							reject(err);
// 						})
// 					}
// 					//resolve(res);
// 				},
// 				(err)=>{
// 					console.log(err);
// 					reject(err);
// 				});
// 			});

// 		}

// 	}
// }