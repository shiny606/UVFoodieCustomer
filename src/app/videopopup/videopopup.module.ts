import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideopopupPageRoutingModule } from './videopopup-routing.module';

import { VideopopupPage } from './videopopup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideopopupPageRoutingModule
  ],
  declarations: [VideopopupPage]
})
export class VideopopupPageModule {}
