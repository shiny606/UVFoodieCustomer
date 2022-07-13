import { Network } from '@ionic-native/network/ngx';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-driver-rating',
  templateUrl: './driver-rating.page.html',
  styleUrls: ['./driver-rating.page.scss'],
})
export class DriverRatingPage implements OnInit {
  id: any;
  name: any;
  rate: any = 2;
  comment: any = '';
  total: any;
  rating: any[] = [];
  OrderId:any;
  way: any;
  networkType;
  constructor(
    public util: UtilService,
    public api: ApisService,
    private route: ActivatedRoute,
    public network: Network,

  ) {

    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id && data.name) {
        this.id = data.id;
        this.name = data.name;
        this.way = 'order';
        this.OrderId = data.OrderId;
        console.log('id', this.id);
        console.log('name', this.name);
        const param = {
          where: 'did = ' + this.id
        };
        this.util.show();
        this.api.post('rating/getFromCount', param).then((data: any) => {
          this.util.hide();
          console.log('data', data);
          if (data && data.status === 200) {
            if (data && data.data && data.data.total) {
              this.total = data.data.total;
              if (data.data.rating) {
                const rats = data.data.rating;
                console.log(rats.split(','));
                this.rating = rats.split(',');
              } else {
                this.rating = [];
              }
            } else {
              this.total = 0;
              this.rating = [];
            }
          } else {
            this.total = 0;
            this.rating = [];
          }
          console.log('total', this.total);
        }, error => {
          console.log(error);
          this.util.hide();
          this.total = 0;
          this.rating = [];
        });
      }
    });

  }

  ngOnInit() {
  }

  close() {
    this.util.back();
  }

  onRatingChange(event) {
    console.log(event);
  }

  submit() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    this.rating.push(this.rate);
    let count = 0;
    const sum = this.rating.reduce((sum, item, index) => {
      item = parseFloat(item);
      console.log(sum, item, index);
      count += item;
      return sum + item * (index + 1);
    }, 0);
    console.log(sum / count);
    const storeRating = (sum / count).toFixed(2);
    console.log('rate', this.rate, this.comment);
    if (this.comment === '') {
      this.util.errorToast(this.util.translate('Something went wrong'));
      return false;
    }
    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: this.id,
      sid: 0,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
      oid: this.OrderId
    };
    console.log("rate==111==="+this.OrderId)
    this.util.show();
    this.api.post('rating/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status === 200) {
        this.util.showToast(this.util.translate('Rating added'), 'success', 'bottom');
        this.close();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
}

}
