import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

let apiURL = 'https://www.aeservices.com.br/api/patyrocks/v1.2/';
/*
  Generated class for the AuthServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServicesProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServicesProvider Provider');
  }

  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.post(apiURL + type, JSON.stringify(credentials), {headers : headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getData(type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.get(apiURL + type, {headers : headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  updateData(credentials, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.put(apiURL + type, JSON.stringify(credentials), {headers : headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteData(type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.delete(apiURL + type, {headers : headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

}
