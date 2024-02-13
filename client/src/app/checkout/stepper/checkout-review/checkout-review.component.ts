import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../../checkout.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent {
  @Input() appStepper: CdkStepper;
  public stepReviewForm: FormGroup;

  constructor(
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {}

  stepReviewSubmit() {}

  createPaymentIntent() {
     const paymentInetnt = this.checkoutService.createPaymentIntent();
    if (paymentInetnt) {
      this.appStepper.next();
    }
  }
}
