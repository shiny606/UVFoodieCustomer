import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageaddressPage } from './manageaddress.page';

const routes: Routes = [
  {
    path: '',
    component: ManageaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageaddressPageRoutingModule {}
