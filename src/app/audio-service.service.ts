import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AudioServiceService {
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(private platform: Platform,private nativeAudio: NativeAudio) { }
  preload(key: string, asset: string): void {

    if(this.platform.is('cordova') && !this.forceWebAudio){
      console.log("preload==")

      this.nativeAudio.preloadSimple(key, asset);

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {
      console.log("preload=11=")
      let audio = new Audio();
      audio.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }

  }

  play(key: string): void {
    console.log("preload=21=")
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    console.log("preload=31="+soundToPlay)
    if(soundToPlay.isNative){
      console.log("preload=33=")
      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();

    }

  }
  stop(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.stop(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      // this.audioPlayer.src = soundToPlay.asset;
      // this.audioPlayer.play();

    }

  }

}
