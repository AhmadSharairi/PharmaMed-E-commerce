import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BasketSummaryComponent } from '../shared/components/basket-summary/basket-summary.component';
import { CheckoutModule } from '../checkout/checkout.module';
import { CheckoutService } from '../checkout/checkout.service';

@NgModule({
  declarations: [BasketComponent],
  imports: [
     CommonModule,
     BasketRoutingModule,
     FormsModule,
     SharedModule ,
     CheckoutModule

    ],
})
export class BasketModule {}
