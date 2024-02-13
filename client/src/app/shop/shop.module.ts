import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShopRoutingModule } from './shop-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { HomeModule } from '../home/home.module';
import { HomeComponent } from '../home/home.component';





@NgModule({
    declarations: [
        ShopComponent,
        ProductItemComponent,
        ProductDetailsComponent,

    ],
    exports:[ProductItemComponent],

    imports: [
        FormsModule,
        CommonModule,
        SharedModule ,
        ShopRoutingModule ,
        NgxSpinnerModule ,
        FontAwesomeModule,
        ToastrModule ,







    ]

})
export class ShopModule { }
