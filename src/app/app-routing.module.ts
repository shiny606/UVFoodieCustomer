/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LocationGuard } from './locationGuard/location.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    //canActivate: [LocationGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsPageModule)
  },
  {
    path: 'choose-address',
    loadChildren: () => import('./pages/choose-address/choose-address.module').then(m => m.ChooseAddressPageModule)
  },
  {
    path: 'add-new-address',
    loadChildren: () => import('./pages/add-new-address/add-new-address.module').then(m => m.AddNewAddressPageModule)
  },
  {
    path: 'coupons',
    loadChildren: () => import('./pages/coupons/coupons.module').then(m => m.CouponsPageModule)
  },
  {
    path: 'history-detail',
    loadChildren: () => import('./pages/history-detail/history-detail.module').then(m => m.HistoryDetailPageModule)
  },
  {
    path: 'choose-restaurant',
    loadChildren: () => import('./pages/choose-restaurant/choose-restaurant.module').then(m => m.ChooseRestaurantPageModule)
  },
  {
    path: 'add-review',
    loadChildren: () => import('./pages/add-review/add-review.module').then(m => m.AddReviewPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'tracker',
    loadChildren: () => import('./pages/tracker/tracker.module').then(m => m.TrackerPageModule)
  },
  {
    path: 'stripe-payments',
    loadChildren: () => import('./pages/stripe-payments/stripe-payments.module').then(m => m.StripePaymentsPageModule)
  },
  {
    path: 'add-card',
    loadChildren: () => import('./pages/add-card/add-card.module').then(m => m.AddCardPageModule)
  },
  {
    path: 'select-drivers',
    loadChildren: () => import('./pages/select-drivers/select-drivers.module').then(m => m.SelectDriversPageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then(m => m.InboxPageModule)
  },
  {
    path: 'rate',
    loadChildren: () => import('./pages/rate/rate.module').then(m => m.RatePageModule)
  },
  {
    path: 'rest-details',
    loadChildren: () => import('./pages/rest-details/rest-details.module').then(m => m.RestDetailsPageModule)
  },
  {
    path: 'cities',
    loadChildren: () => import('./pages/cities/cities.module').then(m => m.CitiesPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then(m => m.ForgotPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/location/location.module').then(m => m.LocationPageModule)
  },
  {
    path: 'pick-location',
    loadChildren: () => import('./pages/pick-location/pick-location.module').then(m => m.PickLocationPageModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsPageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./pages/faqs/faqs.module').then(m => m.FaqsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsPageModule)
  },
  {
    path: 'driver-rating',
    loadChildren: () => import('./pages/driver-rating/driver-rating.module').then(m => m.DriverRatingPageModule)
  },
  {
    path: 'product-rating',
    loadChildren: () => import('./pages/product-rating/product-rating.module').then(m => m.ProductRatingPageModule)
  },
  {
    path: 'select-country',
    loadChildren: () => import('./pages/select-country/select-country.module').then(m => m.SelectCountryPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then(m => m.SuccessPageModule)
  },
  {
    path: 'editbasicdetails',
    loadChildren: () => import('./pages/editbasicdetails/editbasicdetails.module').then(m => m.EditbasicdetailsPageModule)
  },
  {
    path: 'manageaddress',
    loadChildren: () => import('./pages/manageaddress/manageaddress.module').then(m => m.ManageaddressPageModule)
  },
  {
    path: 'editaddress',
    loadChildren: () => import('./pages/editaddress/editaddress.module').then(m => m.EditaddressPageModule)
  },
  {
    path: 'confirmdelete',
    loadChildren: () => import('./pages/confirmdelete/confirmdelete.module').then(m => m.ConfirmdeletePageModule)
  },
  {
    path: 'helpsupport',
    loadChildren: () => import('./pages/helpsupport/helpsupport.module').then(m => m.HelpSupportPageModule)
  },
  {
    path: 'orderissue-detail',
    loadChildren: () => import('./pages/orderissue-detail/orderissue-detail.module').then(m => m.OrderIssueDetailPageModule)
  },
  {
    path: 'orderissue',
    loadChildren: () => import('./pages/orderissue/orderissue.module').then(m => m.OrderIssuePageModule)
  },
  {
    path: 'transaction',
    loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionPageModule)
  },
  {
    path: 'trackeraddress',
    loadChildren: () => import('./pages/trackeraddress/trackeraddress.module').then(m => m.TrackerAddressPageModule)
  },
  
  {
    path: 'addaddress',
    loadChildren: () => import('./addaddress/addaddress.module').then( m => m.AddaddressPageModule)
  },
  {
    path: 'videopopup',
    loadChildren: () => import('./videopopup/videopopup.module').then( m => m.VideopopupPageModule)
  },
 
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
