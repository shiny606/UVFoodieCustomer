import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
@Injectable({
  providedIn: 'root'
})
export class AndroidPermissionService {

  options: GeolocationOptions;
  currentPos: Geoposition;
  subscription: any;
  locationCoords: any;
  apiResponse: any;
constructor(public toastController: ToastController,
  private diagnostic: Diagnostic,
  private androidPermissions: AndroidPermissions,
  private geolocation: Geolocation,
  private locationAccuracy: LocationAccuracy) {
this.locationCoords = {
     latitude: "",
     longitude: "",
     accuracy: "",
     timestamp: ""
  }
}
async locationStatus() {
  return new Promise((resolve, reject) => {
     this.diagnostic.isLocationEnabled().then((isEnabled) => {
     console.log(isEnabled);
     if (isEnabled === false) {
        resolve(false);
     } else if (isEnabled === true) {
        resolve(true);
     }
   })
 .catch((e) => {
 // this.showToast('Please turn on Location');
 reject(false);
 });
});
}

async checkLocationEnabled() {
   return new Promise((resolve, reject) => {
     this.diagnostic.isLocationEnabled().then((isEnabled) => {
        console.log("diagnostic.isLocationEnabled "+isEnabled);
        if (isEnabled === false) {
           //this.showToast('Please turn on Location Service');
           this.checkGPSPermission().then((response) => {
           console.log(response, 'checkGPSPermission-checkLocationEnabled');
           this.apiResponse = response;
           if(this.apiResponse === false) {
              reject(false);
           } else {
              resolve(this.apiResponse);
           }
         })
        .catch((e) => {
           console.log(e, 'checkGPSPermission-checkLocationEnabled');
           reject(false);
      });
           
        } else if (isEnabled === true) {
           this.checkGPSPermission().then((response) => {
           console.log(response, 'checkGPSPermission-checkLocationEnabled');
           this.apiResponse = response;
           if(this.apiResponse === false) {
              reject(false);
           } else {
              resolve(this.apiResponse);
           }
         })
        .catch((e) => {
           console.log(e, 'checkGPSPermission-checkLocationEnabled');
           reject(false);
      });
    }
  })
   .catch((e) => {
           this.showToast('Please turn on Location');
           reject(false);
   });
 });
}
//Check if application having GPS access permission
async checkGPSPermission() {
 return new Promise((resolve, reject) => {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
 result => {
   console.log("androidPermissions.checkPermission "+result.hasPermission);
   if (result.hasPermission) {
       console.log('hasPermission-YES');
      //If having permission show 'Turn On GPS' dialogue
      this.askToTurnOnGPS().then((response) => {
        console.log(response, 'askToTurnOnGPS-checkGPSPermission');
         this.apiResponse = response;
      if (this.apiResponse === false) {
         reject(this.apiResponse);
      } else {
         resolve(this.apiResponse);
      }
    });
  } else {
    console.log('hasPermission-NO');
    //If not having permission ask for permission
    this.requestGPSPermission().then((response) => {
       console.log(response, 'requestGPSPermission-checkGPSPermission');
       this.apiResponse = response;
       if (this.apiResponse === false) {
          reject(this.apiResponse);
       } else {
          resolve(this.apiResponse);
       }
     });
    }
  },
  err => {
    alert(err);
    reject(false);
  });
});
}
async requestGPSPermission() {
 return new Promise((resolve, reject) => {
 this.locationAccuracy.canRequest().then((canRequest: boolean) => {
 if (canRequest) {
    console.log("4");
 } else {
  //Show 'GPS Permission Request' dialogue
     this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
  // call method to turn on GPS
  this.askToTurnOnGPS().then((response) => {
     console.log(response, 'askToTurnOnGPS-requestGPSPermission');
     this.apiResponse = response;
     if (this.apiResponse === false) {
       reject(this.apiResponse);
     } else {
       resolve(this.apiResponse);
     }
   });
 },
  error => {
   //Show alert if user click on 'No Thanks'
   //alert('requestPermission Error requesting location permissions ' + error);
  reject(false);
  });
 }
});
});
}
async askToTurnOnGPS() {

   console.log('askToTurnOnGPS askToTurnOnGPS ');

 return new Promise((resolve, reject) => {
 this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((resp) => {
 console.log('askToTurnOnGPS location accuracy '+JSON.stringify(resp ));
// When GPS Turned ON call method to get Accurate location coordinates
this.apiResponse = resp;
if(resp['code'] === 0) {
   //resolve(this.apiResponse);
      console.log('askToTurnOnGPS location accuracy code 0 ');

   // this.getLocationCoordinates().then((cords) => {
   //   console.log(cords, 'coords');
   //   this.apiResponse = cords;
   //   if(this.apiResponse === false) {
   //      reject(false);
   //   } else {
   //      resolve(this.apiResponse);
   //   }
   // });

   resolve(this.apiResponse);
  }else if(resp['code'] === 1){
      console.log('askToTurnOnGPS location accuracy code 1 ');

   // this.getLocationCoordinates().then((cords) => {
   //   console.log(cords, 'coords');
   //   this.apiResponse = cords;
   //   if(this.apiResponse === false) {
   //      reject(false);
   //   } else {
   //      resolve(this.apiResponse);
   //   }
   // });
   resolve(this.apiResponse);
  }
   error => {
    alert('Error requesting location permissions');
    reject(false);
   }
 },
  error => {
   //Show alert if user click on 'No Thanks'
    console.log('askToTurnOnGPS lrequestPermission Error requesting location permissions '+JSON.stringify(error ));

   //alert('requestPermission Error requesting location permissions ' + error);
    resolve(error.code);
  });

});
}
async getLocationCoordinates() {
 return new Promise((resolve, reject) => {

           console.log('getLocationCoordinates ');
 this.options = {
   maximumAge: 3000,
   enableHighAccuracy: true
 };
   this.geolocation.getCurrentPosition(this.options).then((resp) => {
   this.locationCoords.latitude = resp.coords.latitude;
   this.locationCoords.longitude = resp.coords.longitude;
   this.locationCoords.accuracy = resp.coords.accuracy;
   this.locationCoords.timestamp = resp.timestamp;
   console.log(resp, 'get locc');

    console.log("resp.coords.latitude"+resp.coords.latitude, 'get locc');
          console.log("resp.coords.longitude"+resp.coords.longitude, 'get longitude');

   resolve(this.locationCoords);
},
  error => {
               console.log('getLocationCoordinates Error getting location ');

   alert('Error getting location');
   reject(false);
 });
});
}



async showToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 2000
  });
  toast.present();
}

async presentToastWithOptions() {
  const toast = await this.toastController.create({
    header: 'Toast header',
    message: 'Click to Close',
    position: 'top',
    buttons: [
      {
        side: 'start',
        icon: 'star',
        text: 'Favorite',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  toast.present();
}


}

