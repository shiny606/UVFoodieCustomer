import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, AlertController, PopoverController, IonContent, ModalController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { VariationsPage } from '../variations/variations.page';
import { CartService } from 'src/app/services/cart.service';
import { Network } from '@ionic-native/network/ngx';
import { element } from 'protractor';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  @ViewChild('content', { static: true }) content: IonContent;
  id: any;
  item: any;
  dish:any;
  name: any;
  store_types: any;
  descritions: any;
  cover: any = '';
  address: any;
  rating: any;
  total_deliveries :any;
  total_dish_count: any;
  time: any;
  totalRatting: any;
  dishPrice: any;
  cusine: any[] = [];
  foods:  any[] = [];
  dummyFoods: any[] = [];
  dummyFoods1: any[] = [];
  categories: any[] = [];
  dummy = Array(5);
  dummyfilter: any[] = [];
  veg: boolean;
  deliveryAddress: any = '';
  addressData;
  restDetail;
  caetId: any;
  vegType: any[] = [];
  noVariantCart: any[] = [];
  public vegDefault: string = "All";
  networkType;
  dummyRest: any[] = [];
  allRest: any[] = [];
  listFilter='';
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private popoverController: PopoverController,
    private modalCtrl: ModalController,
    public cart: CartService,public network: Network,
    private chMod: ChangeDetectorRef
  ) {    
    this.vegType = [
      this.util.translate('All'),
      this.util.translate('Veg'),
      this.util.translate('Non Veg'),
    ];
    this.route.queryParams.subscribe(data => {      
      if (data.hasOwnProperty('id')) {
        this.id = data.id;       
        this.getFoodByCid(1);   
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {     
      this.addressData = params["clickdata"];   
        const info = JSON.parse(this.addressData);
        this.name = info.name;
        this.address = info.address;
        this.rating = info.rating;
        this.id = info.id;
        this.total_dish_count = info.total_dish_count;
        this.total_deliveries = info.total_deliveries;
        this.time = info.time;
        this.store_types= info.store_types;
    });
  }

  pos=0;
  getFoodByCid(pos1) {
    this.pos=pos1;
 this.networkType = this.network.type;
 if(this.networkType=='none'){
  this.api.connectionAlert();
 }else{
    const param = {
      restId: this.id,
      veg_type: pos1
    };
    this.dummy = Array(5);
    this.foods = [];    
    this.dummyfilter = [];    
    this.api.post('Restaurant/get_nearMe_store_detail', param).then((data: any) => {
      this.dummy = [];      
      if (data && data.status == 200 && data.data.length > 0) {  
        this.allRest = [];
        this.dummyRest = [];     
        data.data = data.data.filter(x => x.status === 1); 
        if(data.data.length > 0)
        {          
        data.data.forEach(element => {
          if (element.variations && element.variations !== '' && typeof element.variations === 'string') {                
            element.variations = element.variations;
          } else {           
            element.variations = [];
          }
          if (this.cart.itemId.includes(element.id)) {            
            const index = this.cart.cart.filter(x => x.id === element.id);            
            if (index && index.length>0) {                        
              element['quantiy'] = index[0].quantiy;
              element['selectedItem'] = index[0].selectedItem;
            } else {                  
              element['quantiy'] = 0;
              element['selectedItem'] = [];
            }
          } else { 
            element['quantiy'] = 0;
            element['selectedItem'] = [];
          }
        }); 
        this.dummyFoods1=data.data[0].store_types;     
        if(this.dummyFoods1!=null&&this.dummyFoods1.length>0)
        {
          for (var i = 0; i < this.dummyFoods1.length; i++) {
            if(this.dummyFoods1[i].all_dishes!=undefined&&this.dummyFoods1[i].all_dishes!=null&&this.dummyFoods1[i].all_dishes.length>0)
            {
              for(var j=0;j<this.dummyFoods1[i].all_dishes.length;j++)
              {
                this.dummyFoods1[i].all_dishes[j].lat=data.data[0].lat;
                this.dummyFoods1[i].all_dishes[j].lng=data.data[0].lng;
                this.dummyFoods1[i].all_dishes[j].quantiy=0;
              }
              console.log(JSON.stringify( this.dummyFoods1[i]));
              this.dummyfilter.push(this.dummyFoods1[i]);
              this.foods.push(this.dummyFoods1[i]);            
            }
          }          
        }
       
        if(this.cart!=null&&this.cart.cart!=null&&this.cart.cart.length>0)
        {          
          this.foods.forEach(element => {            
            if(element.all_dishes!=null&&element.all_dishes.length>0)
            { 
              element.all_dishes.forEach(element1 => {
                this.item=this.cart.cart.filter(x => x.id === element1.id)
                if(this.item!=null&&this.item.length>0)
                {             
                  element1['quantiy'] = this.item[0].quantiy;                  
                }               
              });
            }            
          });
        }        
        this.dummyFoods = data.data;
        this.chMod.detectChanges();
      }
    }
    }, error => {     
      this.dummy = [];
      console.log("test==="+error)
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {  
      console.log("test=111=="+error)   
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }  

  onSearchChange(event) { 

    // console.log(event.detail.value);
    // if (event.detail.value && event.detail.value !== '') {
    //   this.foods = this.dummyfilter.filter((ele: any) => {
    //     return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
    //   });
    // } else {
    //   this.foods = this.dummyfilter;
    // }


    console.log('evenytttt===='+event.detail.value);
    if (event.detail.value && event.detail.value !== '') {
      this.foods = []; 
      for(var i=0;i<this.dummyfilter.length;i++)
      {
       var data=  this.dummyfilter[i].all_dishes.filter((ele: any) => {
          return ele.name.toLowerCase().includes(event.detail.value.toLowerCase());
        });        
        if(data!=null&&data.length>0)
        {
          var data2=this.dummyfilter[i];
          data2.all_dishes=data;
          this.foods.push(data2);
          
        }
      }   
      this.chMod.detectChanges();   
    } else {  
      this.getFoodByCid(this.pos);
    }    
    
  }

  segmentChanged(id) {
    this.getFoodByCid(id); 
    this.listFilter='';
   
  }

  getFoods() {}

  back() {
    this.navCtrl.navigateRoot(['tabs/tab1']);
  }

  getCusine(cusine) {
    return cusine.join('-');
  }
  add(j,index) {
    // const uid = localStorage.getItem('uid');      
    // if (uid && uid != null && uid !== 'null') {
      if (this.cart.cart.length == 0) {
        if (this.foods[index].all_dishes[j].variations && this.foods[index].all_dishes[j].variations.length) {
          
        } else {
          this.foods[index].all_dishes[j].quantiy = 1;
          this.foods[index].all_dishes[j].restId = this.id;
          this.cart.addItem(this.foods[index].all_dishes[j]);
        }
      } else {        
        const restIds = this.cart.cart.filter(x => x.restId === this.id);
        console.log(restIds);
        if (restIds && restIds.length > 0) {
          if (this.foods[index].all_dishes[j].variations && this.foods[index].all_dishes[j].variations.length) {
           
          } else {
            this.foods[index].all_dishes[j].quantiy = 1;
            this.foods[index].all_dishes[j].restId = this.id;
            this.cart.addItem(this.foods[index].all_dishes[j]);
          }
        } else {
          this.dummy = [];
          this.presentAlertConfirm();
        }
      }
      this.chMod.detectChanges();
    // } else {     
    //   this.navCtrl.navigateRoot(['login']);
    // }
  }

  getQuanity(id) {    
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  statusChange() {
    const value = this.veg === true ? '1' : '0';
    this.changeStatus(value);
  }

  changeStatus(value) {
    this.foods = this.dummyFoods.filter(x => x.veg === value);
    this.chMod.detectChanges();
  }

  addQ(j,index) {    
    if (this.foods[index].all_dishes[j].variations && this.foods[index].all_dishes[j].variations.length) {
      if (this.foods[index].all_dishes[j].quantiy !== 0) {
        console.log('new variant....');
      }      
    } else {
      this.foods[index].all_dishes[j].quantiy = this.foods[index].all_dishes[j].quantiy + 1;
      this.cart.addQuantity(this.foods[index].all_dishes[j].quantiy, this.foods[index].all_dishes[j].id);
      this.chMod.detectChanges();
    }
  }

  removeQ(j,index) {
    if (this.foods[index].all_dishes[j].quantiy !== 0) {
      if (this.foods[index].all_dishes[j].quantiy >= 1 ) {
        this.foods[index].all_dishes[j].quantiy = this.foods[index].all_dishes[j].quantiy - 1;
        if (this.foods[index].all_dishes[j].quantiy === 0) {
          this.foods[index].all_dishes[j].quantiy = 0;
          this.cart.removeItem(this.foods[index].all_dishes[j].id);
        } else {
          this.cart.addQuantity(this.foods[index].all_dishes[j].quantiy, this.foods[index].all_dishes[j].id);
        }
        this.chMod.detectChanges();
      } 
    } else {
      this.foods[index].all_dishes[j].quantiy = 0;
      this.cart.removeItem(this.foods[index].all_dishes[j].id);
      this.chMod.detectChanges();
    }
  }

async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('Warning'),
      message: this.util.translate(`you already have item's in cart with different restaurant`),
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Clear cart'),
          handler: () => {
            console.log('Confirm Okay');
            this.cart.clearCart();
          }
        }
      ]
    });
    await alert.present();
  }
  
  viewCart() {
    console.log('viewCart');
    const navData: NavigationExtras = {
      queryParams: {
        from: 'category'
      }
    };    
    this.navCtrl.navigateRoot(['tabs/tab2'], navData);
  }

  async presentPopover(ev: any) {
    if (this.categories.length <= 0) {
      return false;
    }
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      componentProps: { data: this.categories, id: this.caetId },
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        this.caetId = data.data.id;
        document.getElementById(this.caetId).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    });
    await popover.present();
  }

  openDetails() {
    const navData: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.navCtrl.navigateRoot(['rest-details'], navData);
  }
}