import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Add this line
import { CheckoutAddressComponent } from './stepper/checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './stepper/checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './stepper/checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './stepper/checkout-payment/checkout-payment.component';
import { CheckoutSuccessComponent } from './stepper/checkout-success/checkout-success.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CheckoutPaymentComponent,
    CheckoutSuccessComponent,


  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    CdkStepperModule,
    MatStepperModule,
    MatSnackBarModule,
    NgStepperModule,
  ],
  exports: [
    CheckoutComponent
  ]
})
export class CheckoutModule {}
