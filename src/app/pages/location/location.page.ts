/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { Platform, AlertController, NavController, MenuController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { UtilService } from 'src/app/services/util.service';


declare var google;
@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  lat: any;
  lng: any;
  accuracy : number;
  address: string;
  

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private router: Router,
    public util: UtilService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private menuController: MenuController,
    private diagnostic: Diagnostic,
    
  ) { }

  ngOnInit() {

   
  }

  getLocation() {
  //   this.platform.ready().then(() => {
  //   this.geolocation.getCurrentPosition().then((resp) => {

  //     this.lat = resp.coords.latitude;
  //     this.lng = resp.coords.longitude;
  //     this.accuracy = resp.coords.accuracy;

  //     this.getAddress(this.lat, this.lng);

  //   }).catch((error) => {
  //     alert('Error getting location' + JSON.stringify(error));
  //   });

  
  // });


    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        //this.grantRequest();
         this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
           result => console.log('Has permission?', result.hasPermission),
           err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
         );
        this.grantRequest();
      } else if (this.platform.is('ios')) {
        this.grantRequest();
      } else {
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.getAddress(this.lat, this.lng);
          }
        }).catch(error => {
          console.log(error);
          this.grantRequest();
        });
      }
    });
  }

  askPermission() {
    this.getLocation();
  }

  grantRequest() {
    this.diagnostic.isLocationEnabled().then((data) => {
      if (data) {
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('resp', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.getAddress(resp.coords.latitude, resp.coords.longitude);
          }
        }).catch(error => {
          console.log('ERORROR 1 and open', JSON.stringify(error));
          this.diagnostic.switchToSettings();
        });
      } else {
        this.diagnostic.switchToSettings();
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
          if (resp) {
            console.log('ress,', resp);
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            this.getAddress(resp.coords.latitude, resp.coords.longitude);
          }
        }).catch(error => {
          console.log('ERORROR 1 and open', JSON.stringify(error));
          this.diagnostic.switchToSettings();
        });
      }
    }, error => {
      console.log('errir ????????????????/', error);
      if (this.platform.is('ios')) {
        this.iOSAlert();
      } else {
        this.presentAlertConfirm();
      }
    }).catch(error => {
      console.log('error ******************', error);
      if (this.platform.is('ios')) {
        this.iOSAlert();
      } else {
        this.presentAlertConfirm();
      }
    });

  }

  getAddress(lat, lng) {


    console.log('lat', lat, 'lon', lng);
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    let latlng = {lat, lng};
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log('geocode=====', location);
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.lat = lat;
        this.lng = lng;
        console.log('results=====', lat, lng);
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', this.lat);
        localStorage.setItem('address', results[0].formatted_address);
        localStorage.setItem('lng', this.lng);
        this.util.cityAddress = results[0].formatted_address;
        console.log('cityAddress3', this.util.cityAddress);
        this.util.publishLocation();
        this.navCtrl.navigateRoot(['/home']);
      } else {
        console.log('errorToast===');
        this.util.errorToast('Something went wrong please try again later');
      }
    });
    this.navCtrl.navigateRoot(['/home']);
  }

  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }



  async iOSAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Please Enable Location Service for best experience',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.diagnostic.switchToSettings();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Please Enable Location Service for best experience',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.askPermission();
          }
        }
      ]
    });

    await alert.present();
  }
  async customLocation() {
    this.navCtrl.navigateRoot(['pick-location']);
  }

 

  ionViewWillEnter() {
    console.log('disbaled');
    this.menuController.enable(false);
  }
  ionViewWillLeave() {
    console.log('enabled');
    this.menuController.enable(true);
  }
}
