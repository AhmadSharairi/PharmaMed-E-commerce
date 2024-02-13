import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Stripe, StripeCardElementChangeEvent, loadStripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { OrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../../checkout.service';
import { Basket, IBasketTotals } from 'src/app/shared/models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from 'src/app/shared/models/address';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  private orderSubscription: Subscription;
  public stepPaymentForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  stripe: Stripe | any;
  isSubmitting = false;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: string | null = null;
  loading: boolean = false;
  cardHandler = this.onChange.bind(this);
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;


  initialBasketTotals: IBasketTotals = {
    shipping: 0,
    subtotal: 0,
    discount: 0.05,
    tax: 0.16,
    total: 0,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.stepPaymentForm = this.fb.group({
      nameOnCard: [
        '',
        [
          Validators.required,
          Validators.maxLength(26),
          Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
          this.lengthValidator(5, 26),
        ],
      ],
    });
  }

  ngAfterViewInit() {
    loadStripe(
      'pk_test_51ORTJpKFsl235Eivy4JlIwNrKgbWzPsG2q1p6qDhdpxmK4w21Migb7hp2Qo1u8Hz5RmjPRIRsthdw8zwykTRekvT00E8fzGlEg'
    ).then((stripe) => {
      this.stripe = stripe;

      const elements = stripe.elements();

      this.cardNumber = elements.create('cardNumber');
      this.cardNumber.mount(this.cardNumberElement.nativeElement);
      this.cardNumber.addEventListener('change', this.cardHandler);

      this.cardExpiry = elements.create('cardExpiry');
      this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
      this.cardExpiry.addEventListener('change', this.cardHandler);

      this.cardCvc = elements.create('cardCvc');
      this.cardCvc.mount(this.cardCvcElement.nativeElement);
      this.cardCvc.addEventListener('change', this.cardHandler);
    });
  }

  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();

    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }




  onChange(event: StripeCardElementChangeEvent) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType as 'cardNumber' | 'cardExpiry' | 'cardCvc')
    {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  async submitOrder() {
    if (
      this.stepPaymentForm.invalid ||
      !this.cardNumber ||
      !this.cardExpiry ||
      !this.cardCvc
    ) {
      this.toastr.error(
        'Please fill in all required fields and provide valid card details.'
      );
      return;
    }
    this.loading = true;

    const basket = this.basketService.getCurrentBasketValue();

    if (basket) {
      try {
        const result = await this.stripe.confirmCardPayment(
          basket.clientSecret,
          {
            payment_method: {
              card: this.cardNumber,
              billing_details: {
                name: this.stepPaymentForm.get('nameOnCard').value,
              },
            },
          }
        );
        await this.createOrder(basket);
        this.handleStripeResult(result);
        this.loading = false;
      } catch (error) {
        this.handleStripeError(error);
        this.loading = false;
      }
    }
  }

  private async createOrder(basket: Basket): Promise<void> {
    const orderToCreate = this.getOrderToCreate(basket);

    if (!orderToCreate) {
      console.error('Invalid order data. Unable to create an order.');
      return null;
    } else {
      try {
        const response = await this.checkoutService
          .createOrder(orderToCreate)
          .toPromise();
        console.log('Order created successfully:', response);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    const deliveryMethodId = this.checkoutService.getDeliveryIdFormData();
    const shipToAddress = this.checkoutService.getAddressFormData() as IAddress;

    if (!shipToAddress || !deliveryMethodId) {
      console.error(
        'Incomplete address or delivery information. Unable to get Order To Create.'
      );
      return null;
    }

    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress,
    };
  }

  private handleStripeResult(result: any) {
    if (result && result.error) {
      console.error('Payment failed:', result.error);
      this.toastr.error('Payment Error: ' + result.error.message);
    } else if (
      result &&
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      this.router.navigateByUrl('checkout/success');
      this.toastr.success('Order created successfully');
      this.basketService.resetBasketState();
      this.cdr.detectChanges();

    } else {
      console.error('Unexpected result:', result);
      this.toastr.error('Unexpected payment result');
      this.cdr.detectChanges();
    }
  }

  private handleStripeError(error: any) {
    console.error('Stripe error:', error);
    this.toastr.error('Error confirming card payment. Please check your card details and try again.');
  }

  isInvalid(controlName: string): boolean {
    const control = this.stepPaymentForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  lengthValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value) {
        if (value.length < minLength) {
          return { minLengthExceeded: { minLength } };
        } else if (value.length > maxLength) {
          return { maxLengthExceeded: { maxLength } };
        }
      }
      return null;
    };
  }
}
