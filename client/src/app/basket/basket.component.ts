import { Component, OnInit } from '@angular/core';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  basketTotal$: Observable<IBasketTotals>;
  basketItems$: Observable<IBasketItem>;
  baske$: Observable<IBasket>;

  basket$: Observable<IBasket>;

  derivedShippingValue: number = 0;
  derivedSubtotalValue: number = 0;
  derivedTotalValue: number = 0;
  derivedTaxValue: number;
  derivedDiscountValue: number = 0;


  items:IBasketItem[];
  id: string
  basketItemId:number;

  productName:string;
  price:number;
  quantity:number;
  pictureUrl:string;
  brand:string;
  type: string;
  breadcrumb$: Observable<any>; // You can replace 'any' with the actual type of your breadcrumb data



  constructor(private basketService: BasketService ) {



   }

  ngOnInit() {
    this.initializeTotalSummary();


  }


  initializeTotalSummary(){
    this.basketService.basketTotal$.subscribe((basketTotal) => {
      this.derivedShippingValue = basketTotal.shipping;
      this.derivedSubtotalValue = basketTotal.subtotal;
      this.derivedTotalValue = basketTotal.total;
      this.derivedDiscountValue = basketTotal.discount;
      this.derivedTaxValue = basketTotal.tax;

    });

  }


}

