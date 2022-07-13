/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NavController,AlertController,MenuController,ActionSheetController, ToastController, LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  baseUrl: any = '';
  mediaURL: any = '';
  mediaURLProfile: any = '';
  networkType;
  
  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,public network: Network,
    private localNotifications: LocalNotifications,
    public alertCtrl:AlertController,
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
    this.mediaURLProfile = environment.mediaURLProfile;
    this.networkType = this.network.type;
    //nativeHttp.setDataSerializer('json');
  }

  translate(str) {
    return str;
  }

  alerts(title, message, type) {
    Swal.fire(
      title,
      message,
      type
    );
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('userfile', f));
    return this.http.post(this.baseUrl + 'users/upload_image', formData);
  }

  instaPay(url, body, key, token) {
    return this.nativeHttp.post(url, body, {
      'X-Api-Key': `${key}`,
      'X-Auth-Token': `${token}`
    });
  }



  getCurrencyCode() {
    return 'none';
  }

  getCurrecySymbol() {
    return 'none';
  }

  // sendNotifications(msg, title, id){
    
  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: msg,
  //     //sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
  //     //data: { secret: key }
  // });
  // }


//   sendNotification(msg, title, id) {
//     const body = {
//       app_id: environment.onesignal.appId,
//       include_player_ids: [id],
//       headings: { en: title },
//       contents: { en: msg },
//       data: { task: msg }
//     };
//     const header = {
//       headers: new HttpHeaders()
//         .set('Content-Type', 'application/json')
//         .set('Accept', 'application/json')
//         .set('responseType', 'text')
//         .set('Authorization', `Basic ${environment.onesignal.restKey}`)
//     };

//     this.http.post("https://onesignal.com/api/v1/notifications", body, header)
// .subscribe(data => {
// console.log("data----"+data)
// }, error => {
//   console.log("data--error--"+error.message)
//   console.log("data--2--"+JSON.stringify(error));
  
// });
//     //return this.http.post('https://onesignal.com/api/v1/notifications', body, header);
//   }


//   sendNotification(msg, title, id) {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json')
//     .set('Accept', 'application/json')
//     .set('responseType', 'text')
//     .set('Authorization',  'Bearer ' + environment.onesignal.restKey);

// this.http.post("https://onesignal.com/api/v1/notifications", msg, { headers: headers })
// .subscribe(data => {
// console.log("data----"+data)
// }, error => {
//   console.log("data--error--"+error)
// });
//   }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
          
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public get(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
        // .set('responseType', 'blob')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public externalGet(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  nativePost(url, post) {
    console.log(this.baseUrl + url, post);
    return this.nativeHttp.post(this.baseUrl + url, post, {
      Basic: `${environment.authToken}`
    });
  }

  httpGet(url, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };

    return this.http.get(url, header);
  }

  async  connectionAlert(){
    
    const alert = await this.alertCtrl.create({
         header: 'Alert',
         subHeader: 'No internet connection',
         message: 'Sorry, no internet connectivity detected. Please reconnect and try again.',
         buttons: ['OK']
       });
    
       await alert.present();
    
    }

  externalPost(url, body, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order)
    return this.http.post(url, order, header);
  }
}


