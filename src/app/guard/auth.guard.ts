import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApisService } from '../services/apis.service';
import { Platform, ActionSheetController, NavController } from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private authServ: ApisService, private router: Router,
        private navCtrl: NavController,) { }

    canActivate(route: ActivatedRouteSnapshot): any {
        const uid = localStorage.getItem('uid');
        const skip = localStorage.getItem('skip');
        if (uid && uid != null && uid !== 'null') {
            return true;
        }
        else if(skip && skip != null && skip !== 'null'){
            return true;
        }  
        localStorage.removeItem('loginSkip'); 
        this.navCtrl.navigateRoot(['login']);
        
        return false;
    }
}