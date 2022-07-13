import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavParams } from "@ionic/angular";
import { Network } from '@ionic-native/network/ngx';
import { CartService } from "src/app/services/cart.service";
@Component({
  selector: 'app-confirmdelete',
  templateUrl: './confirmdelete.page.html',
  styleUrls: ['./confirmdelete.page.scss'],
})
export class ConfirmdeletePage implements OnInit {
  public id = this.navParams.get("deleteitem");
  public addr = this.navParams.get("addr");
  networkType;
  constructor(private modalCtrl: ModalController,
    public api: ApisService,
    public util: UtilService,
    private navParams: NavParams,
    private navCtrl: NavController,public cart: CartService,
    public network: Network,) { }

  ngOnInit() {
  }

  closeClick(){
    this.modalCtrl.dismiss();
  }
  cancelClick(){
    this.modalCtrl.dismiss();
  }
  confirmClick(){
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const param = {
      id: this.id
    };
    this.api.post('address/deleteList', param).then(info => {
      console.log(info);
      this.util.hide();    
      this.getAddress();
      if(this.cart.deliveryAddress != null && this.addr != null){
        if(this.cart.deliveryAddress.includes(this.addr))
        {
          
          this.cart.deliveryAddress=null;
          this.cart.addressId=null;
          this.cart.addressLat=null;
          this.cart.addressLng=null;
        }
      }
      
      
      this.util.getObservable().next();
      this.util.showToast('Address Deleted', 'success', 'bottom');
    
      this.cart.calcuate();
      this.modalCtrl.dismiss();
      this.navCtrl.navigateRoot('tabs/tab1');
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }


  getAddress() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.api.post('address/getByUid', param).then((data) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length > 0) {
        this.util.getObservable().next();
        //this.cart.calcuate();
        //this.util.showToast('Address updated', 'success', 'bottom');
      }
    }, error => {
      console.log(error);
     
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
     
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  

}
