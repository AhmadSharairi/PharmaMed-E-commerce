import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './core/about/about.component';
import { IsAuthGuard } from './core/guards/auth.guard';
import { LearnComponent } from './Learn/learn/learn.component';





const routes: Routes = [
{path: '' , component: HomeComponent , data : {breadcrumb: 'Home'}} ,
{path: 'shop' , loadChildren : () => import('./shop/shop.module').then(mod => mod.ShopModule) , data : {breadcrumb: {skip:true}}}, // implemnt Lazy Loading
{path: 'basket' , loadChildren : () => import('./basket/basket.module').then(mod => mod.BasketModule) , data : {breadcrumb: 'Cart'}},

{path: 'checkout', canActivate:[IsAuthGuard] , loadChildren : () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule)},
{path: 'orders' , canActivate:[IsAuthGuard] , loadChildren : () => import('./orders/orders.module').then(mod => mod.OrdersModule), data : {breadcrumb: 'Orders'}} ,

{path: 'contact' , component: ContactComponent , data : {breadcrumb: {skip:true}}} ,
{path: 'learn' , component: LearnComponent , data : {breadcrumb: {skip:true}}} ,

{path: 'about' , component: AboutComponent , data : {breadcrumb: 'About'}} ,
{path: 'account' , loadChildren : () => import('./account/account.module').then(mod => mod.AccountModule) , data : {breadcrumb: {skip:true}}}, // implemnt Lazy Loading



{path: '**' , redirectTo: '' ,  pathMatch: 'full' },




/*Error Components*/
{path: 'test-error' , component: TestErrorComponent },
{ path: 'server-error', component: ServerErrorComponent},
{ path: 'not-found', component: NotFoundComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // implemnt Lazy Loading principle



exports: [RouterModule]
})
export class AppRoutingModule { }
