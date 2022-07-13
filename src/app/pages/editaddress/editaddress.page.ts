import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { CartService } from "src/app/services/cart.service";
declare var google;

@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.page.html',
  styleUrls: ['./editaddress.page.scss'],
})
export class EditaddressPage implements OnInit {
  @ViewChild('map', { static: true }) mapEle: ElementRef;
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
  pincode: any;
  hideMe=false;
  addressData;
  networkType;

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    private navCtrl: NavController,
    public api: ApisService,
    public util: UtilService,
    private route: ActivatedRoute,public cart: CartService,
    private router: Router,
    public network: Network,

  ) {}

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
     
      this.addressData = params["addressData"];
      
        this.from = 'edit';
        const info = JSON.parse(this.addressData);
        this.pincode = info.pincode;
        this.address = info.address;
        this.house = info.house;
        this.id = info.id;
        this.landmark = info.landmark;
        this.lat = info.lat;
        this.lng = info.lng;
        console.log('daaaaa===>', JSON.parse(this.addressData));
      
    });
   
  }
  back(){
    this.navCtrl.navigateRoot('manageaddress');
  }



  updateAddress() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    if (this.address === '' || this.landmark === '' || this.house === '' || !this.pincode || this.pincode === '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    // const geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
    //   console.log(results, status);
    //   if (status === 'OK' && results && results.length) {
    //     this.lat = results[0].geometry.location.lat();
    //     this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.id,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };
        this.util.show();
        this.api.post('address/editList', param).then((data: any) => {
          this.util.hide();
          if (data && data.status == 200) {
            console.log("data.id=="+data.data);
            this.util.publishAddress('');
            if(this.cart.deliveryAddress != null && data.data != null){
              if(this.cart.addressId.includes(data.data))
              {
                
                this.cart.deliveryAddress=null;
                this.cart.addressId=null;
                this.cart.addressLat=null;
                this.cart.addressLng=null;
              }
            }
            
            this.navCtrl.navigateForward('tabs/tab1');
            this.util.showToast('Address updated', 'success', 'bottom');
          } else {
            console.log("addr==22==");
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log("addr==33=="+error);
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


  locationMap(){
    console.log("load===11==")
    this.loadmap(this.lat,this.lng,this.mapEle);
  }

  loadmap(lat, lng, mapElement) {
    console.log("load=====");
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
    console.log('location =>', location);
    const icons = {
      url: 'assets/icon/marker.png',
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
      this.lat = event.position.lat();
      this.lng = event.position.lng();
    });
  }


}
