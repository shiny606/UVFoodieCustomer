
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  networkType;
  dummy: any[] = [];
  users: any[] = [];
  constructor(
    public api: ApisService,
    public util: UtilService,
    private router: Router,
    private navCtrl: NavController,
    public network: Network,
    
  ) {
    this.getChats();
  }


  getChats() {
    this.networkType = this.network.type;
    if(this.networkType=='none'){
     this.api.connectionAlert();
    }else{
    const param = {
      id: localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('chats/getByGroup', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        const info = [];
        data.data.forEach(element => {
          info.push(element.from_id);
          info.push(element.room_id);
        });
        let uniq = [...new Set(info)];
        uniq = uniq.filter(x => x !== localStorage.getItem('uid'));
        console.log('uniq->>', uniq);
        const uid = {
          id: uniq.join()
        };
        this.api.post('stores/getChatsNames', uid).then((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            this.users = uids.data;
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      } else {
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
  }
  ngOnInit() {
  }

  back() {
    this.navCtrl.navigateForward('tabs/tab1');
  }

  onAdmin() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
        uid: localStorage.getItem('uid')
      }
    };
    this.navCtrl.navigateRoot(['inbox'], param);
  }

  onChat(item) {
    console.log(localStorage.getItem('uid'));
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name,
        uid: localStorage.getItem('uid')
      }
    };
    this.navCtrl.navigateRoot(['inbox'], param);
  }
}
