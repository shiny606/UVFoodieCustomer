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
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  content: any;
  loaded: boolean;
  constructor(
    public util: UtilService,
    private api: ApisService,
    private navCtrl: NavController
  ) {
    const param = {
      id: 1
    };
    this.loaded = false;
    this.api.post('pages/getById', param).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        this.content = info.content;
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  getContent() {
    return this.content;
  }

  back() {
    this.navCtrl.navigateForward('tabs/tab1');
  }

  openMenu() {
    this.util.openMenu();
  }
}
