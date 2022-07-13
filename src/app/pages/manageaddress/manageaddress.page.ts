import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { NavigationExtras } from '@angular/router';
import { ConfirmdeletePage } from '../confirmdelete/confirmdelete.page';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-manageaddress',
  templateUrl: './manageaddress.page.html',
  styleUrls: ['./manageaddress.page.scss'],
})
export class ManageaddressPage implements OnInit {
  id: any;
  myaddress: any[] = [];
  from: any;
  selectedAddress: any;
  dummy = Array(10);
  interval;networkType;

  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    public api: ApisService,
    public util: UtilService,
    private cart: CartService,public network: Network,
    private modalCtrl: ModalController,) {

      console.log('notes', this.cart.orderNotes);
      this.route.queryParams.subscribe(data => {
        console.log(data);
        if (data && data.from) {
          this.from = data.from;
        }
      });
      this.getAddress();
      this.util.getObservable().subscribe((data) => {
        this.getAddress();
      });
   }

  ngOnInit() {
    this.getAddress();
    this.util.getObservable().next();
    // this.interval = setInterval(() => {
    //   this.getAddress();
    // }, 12000);
    
   // this.address = localStorage.getItem("address");
  }

  radioGroupChange(event) {
    console.log("radioGroupChange",event.detail.value);
    this.selectedAddress = event.detail.value;
    }

  back() {
    this.navCtrl.navigateRoot('tabs/tab3');
  }
  edit(item){
    console.log("invid==999====="+item);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'edit',
        addressData: JSON.stringify(item),
        
               
      }
  };
    this.navCtrl.navigateForward(['editaddress'],navigationExtras);
    console.log("invid==000====="+this.myaddress);

   
  }

  delete(items,address){
    this.confirmDelete(items,address);

  }

  async confirmDelete(items,address) {
    const modal = await this.modalCtrl.create({
      component: ConfirmdeletePage,
      cssClass: 'custom_modal2',
      componentProps: {
        deleteitem: items,
        addr:address
      }
    });
    return await modal.present();
  }
  addNewAddress(){
    this.navCtrl.navigateForward('add-new-address');
    //this.navCtrl.navigateForward('addaddress');
  }

  getAddress() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const param = {
      id: localStorage.getItem('uid')
    };
    this.api.post('address/getByUid', param).then((data) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        this.myaddress = data.data;
       
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }

  addr:string;
  async selectAddress() {
    if (this.from === 'cart') {
      const selectedAddr = this.myaddress.filter(x => x.id === this.selectedAddress);
      this.cart.addressId=selectedAddr[0].id;
      this.cart.addressLat=selectedAddr[0].lat;
      this.cart.addressLng=selectedAddr[0].lng;
      this.cart.addressPincode=selectedAddr[0].pincode;
          this.cart.calcuate();
          this.addr="";
          this.addr=this.addr+selectedAddr[0].address;  
          this.cart.deliveryAddress=this.addr;
          const navData: NavigationExtras = {
            queryParams: {
              from : 'changeaddress',              
              addressDelivery: this.addr,
              addressId: selectedAddr[0].id,
              addressLat: selectedAddr[0].lat,
              addressLng: selectedAddr[0].lng,
              pincodechng:selectedAddr[0].pincode,
            }
          };         
          this.navCtrl.navigateRoot(['cart'],navData); 
    }   
  }
}