import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from '../basket/basket.service';
import { CheckoutService } from './checkout.service';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private basketTotalSubscription: Subscription;
  items: IBasketItem[];
  basketTotal$: Observable<IBasketTotals>;
  derivedShippingValue = 0;
  derivedSubtotalValue = 0;
  derivedTotalValue = 0;
  derivedTaxValue: number;
  derivedDiscountValue = 0;
  @ViewChild('cdkStepper') cdkStepper: CdkStepper;
  checkoutForm: FormGroup;

  constructor(
    private basketService: BasketService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.subscribeToBasketTotal();
    //this.getDeliveryMethodValue();
  }
  ngOnDestroy() {
    if (this.basketTotalSubscription) {
      this.basketTotalSubscription.unsubscribe();
    }
  }
  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      stepAddressForm: this.fb.group({
        firstName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        locationAddress: ['', [Validators.required]],
        zipCode: ['', [Validators.pattern(/^\d{5}$/)]],
        city: ['', [Validators.required]],
        state: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
        country: ['', [Validators.required]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]*$')],
        ],
      }),
      stepDeliveryForm: this.fb.group({
        deliveryMethod: ['', Validators.required],
      }),
      stepPaymentForm: this.fb.group({
        nameOnCard: ['', Validators.required],
      }),
    });
  }

  private subscribeToBasketTotal(): void {
    this.basketTotalSubscription = this.basketService.basketTotal$.subscribe(
      (basketTotal) => {
        this.derivedShippingValue = basketTotal.shipping;
        this.derivedSubtotalValue = basketTotal.subtotal;
        this.derivedTotalValue = basketTotal.total;
        this.derivedDiscountValue = basketTotal.discount;
        this.derivedTaxValue = basketTotal.tax;
        this.cdr.detectChanges();
      }
    );
  }

  createPaymentIntent() {
    this.checkoutService.createPaymentIntent();
  }


}
