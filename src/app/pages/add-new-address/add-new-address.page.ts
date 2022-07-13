
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
declare var google;

@Component({
  selector: 'app-add-new-address',
  templateUrl: './add-new-address.page.html',
  styleUrls: ['./add-new-address.page.scss'],
})
export class AddNewAddressPage implements OnInit {
  @ViewChild('map', { static: true }) mapEle: ElementRef;
  autocomplete1: { 'query': string };
  autocompleteItems1: any = [];
  geocoder: any;
  GoogleAutocomplete;
  map: any;
  marker: any;
  lat: any;
  lng: any;
  address: any;
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  id: any;
  from: any;
  networkType;
  pincode: any;
 pincds;
  constructor(
    private platform: Platform,public network: Network,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private navCtrl: NavController,
    public api: ApisService,
    public util: UtilService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.from) {
        this.from = 'edit';
        const info = JSON.parse(data.data);
        console.log('daaaaa===>', info);
        this.address = info.address;
        this.house = info.house;
        this.id = info.id;
        this.landmark = info.landmark;
        this.lat = info.lat;
        this.lng = info.lng;
        console.log("loadmap==="+this.lat+ this.lng )
        this.loadmap(this.lat, this.lng, this.mapEle);
      } else {
        this.from = 'new';
        this.getLocation();
      }
    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete1 = { query: '' };
    this.autocompleteItems1 = [];
  }

  ngOnInit() {
    console.log('===address111==='+this.address)
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
            console.log("loadmap=resp=="+this.lat+ this.lng )
            this.loadmap(resp.coords.latitude, resp.coords.longitude, this.mapEle);
            this.getAddress(this.lat, this.lng);
          }
        });
      }
    });
  }

  grantRequest() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 10000, enableHighAccuracy: false }).then((resp) => {
      if (resp) {
        console.log('resp', resp);
        this.loadmap(resp.coords.latitude, resp.coords.longitude, this.mapEle);
        this.getAddress(resp.coords.latitude, resp.coords.longitude);
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
      }
    });
  }

  loadmap(lat, lng, mapElement) {
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
    //const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    //this.map.mapTypes.set('Foodfire5', mapType);
   // this.map.setMapTypeId('Foodfire5');
    this.addMarker(location);
  }

  getAddress(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      var addData= results[0].address_components;
      this.pincds = addData[addData.length - 1].long_name;
      console.log("pincds=22=="+this.pincds);
    });
  }

  addMarker(location) {
    console.log('location =>', location);
    const icons = {
     // url: 'assets/icon/marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icons,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(this.marker, 'dragend', () => {
      console.log(this.marker);
      this.getDragAddress(this.marker);
    });

  }

  getDragAddress(event) {

    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(event.position.lat(), event.position.lng());
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      this.address = results[0].formatted_address;
      var addData= results[0].address_components;
      this.pincds = addData[addData.length - 1].long_name;
      console.log("pincds=11=="+this.pincds);
      this.lat = event.position.lat();
      this.lng = event.position.lng();
    });
  }


  addAddress() {
    console.log("pincds==="+this.pincds);
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    if(this.pincode!= this.pincds){
      this.util.errorToast(this.util.translate('pincode mismatch'));
      return false; 
    }
    // const geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
    //   console.log(results, status);
    //   if (status === 'OK' && results && results.length) {
        //this.lat = results[0].geometry.location.lat();
        //this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        console.log('call api');
        this.util.show();
        const param = {
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };
        this.api.post('address/save', param).then((data: any) => {
          this.util.hide();
          if (data && data.status === 200) {
            this.util.publishAddress('');
            this.util.getObservable().next();
            //this.util.getObservable().next();
            this.util.showToast('Address added', 'success', 'bottom');
            this.navCtrl.navigateRoot('tabs/tab3');
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
   
    this.address = item.description;
    //console.log('cityAddress2', this.util.cityAddress);
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log(status);
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
       
        //this.getAddress1(this.lat,this.lng);
        console.log(this.lat, this.lng);
        //this.chMod.detectChanges();
        this.loadmap(this.lat, this.lng, this.mapEle);
        this.address = results[0].formatted_address; 
        this.getAddress(this.lat, this.lng); 
        //var addData= results[0].address_components;
        //this.pincds = addData[addData.length - 1].long_name;
        console.log("pincds=44=="+this.pincds);
      }
    });
  }

  

}


//   updateAddress() {
//     this.networkType = this.network.type;
//     if(this.networkType=='none'){
//      this.api.connectionAlert();
//     }else{
//     if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
//       this.util.errorToast(this.util.translate('All Fields are required'));
//       return false;
//     }
//     const geocoder = new google.maps.Geocoder;
//     // // geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
//     // //   console.log(results, status);
//     // //   if (status === 'OK' && results && results.length) {
//     //     this.lat = results[0].geometry.location.lat();
//     //     this.lng = results[0].geometry.location.lng();
//         console.log('----->', this.lat, this.lng);
//         const param = {
//           id: this.id,
//           uid: localStorage.getItem('uid'),
//           address: this.address,
//           lat: this.lat,
//           lng: this.lng,
//           title: this.title,
//           house: this.house,
//           landmark: this.landmark,
//           pincode: this.pincode
//         };
//         this.util.show();
//         this.api.post('address/editList', param).then((data: any) => {
//           this.util.hide();
//           if (data && data.status === 200) {
//             this.util.publishAddress('');
//             this.util.getObservable().next();
//             this.navCtrl.back();
           
//             this.util.showToast('Address updated', 'success', 'bottom');
//           } else {
//             this.util.errorToast(this.util.translate('Something went wrong'));
//           }
//         }, error => {
//           console.log(error);
//           this.util.hide();
//           this.util.errorToast(this.util.translate('Something went wrong'));
//         });
//     //   } else {
//     //     this.util.errorToast(this.util.translate('Something went wrong'));
//     //     return false;
//     //   }
//     // });
//   }
// }

