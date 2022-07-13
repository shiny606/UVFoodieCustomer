import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmdeletePage } from './confirmdelete.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmdeletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmdeletePageRoutingModule {}
