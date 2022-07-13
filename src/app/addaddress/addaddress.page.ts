import {  ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { Platform, AlertController, NavController, MenuController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Network } from '@ionic-native/network/ngx';
import { CartService } from "src/app/services/cart.service";
declare var google;
@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;
  autocomplete1: { 'query': string };
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  geocoder: any;
  map: any;
  addr: any;
  lat: any;
  lng: any;
  zipcode;
  marker: any;
  networkType;
  previousMarker: any;
  useaddress: string;
  constructor(
    private chMod: ChangeDetectorRef,public network: Network,public cart: CartService,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private router: Router,
    public util: UtilService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private menuController: MenuController,
    private diagnostic: Diagnostic,public api: ApisService,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete1 = { query: '' };
    this.autocompleteItems1 = [];
  }


  loadMap(lat, lng, mapElement) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }
    ];

    const mapOptions = {
      zoom: 15,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodfire5']
      }
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodfire5', mapType);
    this.map.setMapTypeId('Foodfire5');
    this.addMarker(location);
  }

  addMarker(location) {    
    const icons = {     
      scaledSize: new google.maps.Size(50, 50),
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icons,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(this.marker, 'dragend', () => {
      this.getDragAddress(this.marker);
    });
    
  }

  getDragAddress(event) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(event.position.lat(), event.position.lng());
    geocoder.geocode({ 'location': location }, (results, status) => {     
      this.lat = event.position.lat();
      this.lng = event.position.lng();
      this.cart.deliAddress = results[0].formatted_address;
      //this.util.getObservableAddress().next();
      console.log("useaddress===="+this.cart.deliAddress);
    });
  }

  ngOnInit() {
  }

  close() {
    this.navCtrl.back();
  }

  getLocation() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
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

    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.lat = lat;
        this.lng = lng;
        this.cart.deliAddress = results[0].formatted_address;
        this.loadMap(this.lat, this.lng, this.mapElement);
       
      } else {
        this.util.errorToast('Something went wrong please try again later');
      }
    });
  }


  addAddress() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    if (this.cart.deliAddress === '' ) {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    // const geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
    //   console.log(results, status);
    //   if (status === 'OK' && results && results.length) {
        //this.lat = results[0].geometry.location.lat();
        //this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat,this.lng);
        console.log('call api');
        this.util.show();
        const param = {
          uid: localStorage.getItem('uid'),
          address: this.cart.deliAddress,
          lat: this.lat,
          lng: this.lng,
          title: "home",
          house: "",
          landmark: "",
          pincode: ""
        };
        this.api.post('address/save', param).then((data: any) => {
          this.util.hide();
          if (data && data.status === 200) {
            //this.util.publishAddress('');
            //this.util.getObservable().next();
            this.navCtrl.navigateForward('account');
            //this.util.getObservable().next();
            this.util.showToast('Address added', 'success', 'bottom');
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
    //   } else {
    //     this.util.errorToast(this.util.translate('Something went wrong'));
    //     return false;
    //   }
    // });
  }
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

  

  getPincodeAvail(){
    const param = {
      pincode: this.zipcode,
    };
    console.log('avail==loc==='+JSON.stringify(param))
    this.api.post("Restaurant/check_service_pincode_exist", param).then(
      (data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status == 200) {
          this.util.hide();
        } else if (data && data.status == 201) {
          this.util.errorToast(data.message);
        }
      },
      (error) => {
        console.log(error);
        this.util.hide();
        this.util.showToast(
          this.util.translate("Something went wrong"),
          "danger",
          "bottom"
        );
      }
    );
  }
  

  async onSearchChange(event) {
    if (this.autocomplete1.query === '') {
      this.autocompleteItems1 = [];
      console.log("Retun1");
      return;
    }
    const addsSelected = localStorage.getItem('addsSelecteds');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelecteds');
      console.log("Retun2");
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete1.query }, (predictions, status) => {
      console.log(predictions);
      console.log("predictions==>"+predictions);
      if (predictions && predictions.length > 0) {
        this.autocompleteItems1 = predictions;
      }
      else
      {
        console.log("GoogleAutocomplete not respond");
      }
    });
  }

  selectSearchResult1(item) {
    console.log('select', item);
    localStorage.setItem('addsSelecteds', 'true');
    this.autocompleteItems1 = [];
    this.autocomplete1.query = item.description;
   
    //this.util.cityAddress = item.description;
    //console.log('cityAddress2', this.util.cityAddress);
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(status);
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
       
        //this.getAddress1(this.lat,this.lng);
        console.log(this.lat, this.lng);
        this.chMod.detectChanges();
        this.loadMap(this.lat, this.lng, this.mapElement);
        this.cart.deliAddress = results[0].formatted_address;
      }
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
  ionViewWillLeave() {
    this.menuController.enable(true);
  }
}