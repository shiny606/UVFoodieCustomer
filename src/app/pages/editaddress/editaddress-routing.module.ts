import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditaddressPage } from './editaddress.page';

const routes: Routes = [
  {
    path: '',
    component: EditaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditaddressPageRoutingModule {}
