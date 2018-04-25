import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { Events, Platform } from 'ionic-angular';

import {Facebook} from '@ionic-native/facebook';

declare var window:any;

@Injectable()
export class SocialService {

	mode:string = 'dev';

	ready:boolean = false;
	isBrowser:boolean;
	isIOS:boolean;
	isAndroid:boolean;

	fbPermissions:any[];

	constructor( 
		public http:Http,
		public events:Events,
		public plt:Platform,
		public fb:Facebook){

        this.fbPermissions = ['public_profile', 'user_friends', 'email'];

    	let fbInit = ()=>{
            //window.facebookConnectPlugin.browserInit('138072253579918', '549111bdfa1c347ac4662105ee727652');
            window.facebookConnectPlugin.browserInit('138072253579918', 'v2.11');
    	}

    	plt.ready()
    	.then(source=>{
			console.log(source);
			console.log('iniciou o provider do fb');

    		if(!(this.plt.is('ios') || this.plt.is('android'))){
    			if(!window.facebookConnectPlugin){
    				setTimeout(()=>{
    					console.log(window.facebookConnectPlugin);
    					fbInit();
    				}, 2000);
    			}else{
    				console.log(window.facebookConnectPlugin);
    				fbInit();
    			}
    		}else{
                console.log('não é browser.');
    		}
    	})
    	.catch(err=>{

    	});

		
	}

	fbLogin():Promise<any>{
		if(!(this.plt.is('ios') || this.plt.is('android'))){
            
			return new Promise((resolve, reject)=>{
				window.facebookConnectPlugin.getLoginStatus(
				(res)=>{
					if(res.status == 'connected') {
                        
                        window.facebookConnectPlugin.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', ['public_profile', 'user_friends', 'email'], 
						res=>{
							resolve(res);
						},
						err=>{
							reject(err);
						})
						return res;
					}else{
						window.facebookConnectPlugin.login(['public_profile', 'user_friends', 'email'], 
						res=>{
                            window.facebookConnectPlugin.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', ['public_profile', 'user_friends', 'email'], 
                            res=>{
                                resolve(res);
                            },
                            err=>{
                                reject(err);
                            })
                            return res;
						},
						err=>{
							reject(err);
                        })
                        
					}
					//resolve(res);
				},
				(err)=>{
					console.log(err);
					reject(err);
				});
			});
		}
		else{
            console.log('não é browser');
		}

	}
}