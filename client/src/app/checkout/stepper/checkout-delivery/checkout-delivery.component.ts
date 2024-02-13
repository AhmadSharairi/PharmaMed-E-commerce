import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from './../../checkout.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent implements OnInit {
  public stepDeliveryForm: FormGroup;
  deliveryId:number =0;
  deliveryMethods: IDeliveryMethod[];

  constructor(
    private checkoutService: CheckoutService,
    private basketService: BasketService,
    private fb: FormBuilder
  ) {
    this.stepDeliveryForm = this.fb.group({
      deliveryMethod: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getDeliveryMethods();

  }

  getDeliveryMethods() {
    this.checkoutService.getDeliveryMethods().subscribe(
      (dm: IDeliveryMethod[]) => {
        this.deliveryMethods = dm;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.deliveryId = deliveryMethod.id;
    this.basketService.setShippingPrice(deliveryMethod);
  }

  stepDeliverySubmit() {
    if (this.stepDeliveryForm.valid) {
      this.checkoutService.setDeliveryFormDataId(
        this.stepDeliveryForm.get('deliveryMethod').value
      );
    } else {
      console.error('Invalid DeliveryMethod id');
    }
  }



}
