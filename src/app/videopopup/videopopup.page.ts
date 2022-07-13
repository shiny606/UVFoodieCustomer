import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalController , NavParams } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-videopopup',
  templateUrl: './videopopup.page.html',
  styleUrls: ['./videopopup.page.scss'],
})
export class VideopopupPage implements OnInit {
  videoList= [];
  videoTitle;
  videoUrl;
  loaded: boolean;
  trustedDashboardUrl: SafeUrl;
  constructor(public modalController: ModalController,public api: ApisService,public util: UtilService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.loaded = false;
    this.getVideoList();
  }

  goDismiss(){
    this.modalController.dismiss();
  }
  getVideoList() {
    this.api.get("Restaurant/get_youtube_videos").then(
      (data: any) => {
        if (data.status=='200') {
          this.loaded = true;
          this.videoList = data.data;
          this.videoTitle =  this.videoList[0].title
          this.videoUrl = this.videoList[0].video_url;
          console.log("*************videoUrl" + this.videoUrl);
          this.trustedDashboardUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl
              (this.videoList[0].video_url);
          console.log("*************video" + this.trustedDashboardUrl);
        }
        this.loaded = true;
      },
      (error) => {
        console.log(error);
        this.loaded = true;
        this.util.errorToast(this.util.translate("Something went wrong1"));
        console.log("Something went wrong1" + error);
      }
    );
  }

}
