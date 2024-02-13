import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { ProductItemComponent } from '../shop/product-item/product-item.component';
import { ShopModule } from '../shop/shop.module';



@NgModule({
  declarations: [ HomeComponent 
  ],
  imports: [

  CommonModule,
  SharedModule ,
  ShopModule



  ] ,
  exports: [HomeComponent] ,
})
export class HomeModule { }
