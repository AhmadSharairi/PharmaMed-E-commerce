import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { IBasket } from './../shared/models/basket';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = environment.apiUrl;
  shipp = 0;

  initialBasketTotals: IBasketTotals = {
    shipping: 0,
    subtotal: 0,
    discount: 0.05,
    tax: 0.16,
    total: 0,
  };


  emptyBasket: IBasket = new Basket();
  itemsQuantity: number;

  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(
    this.initialBasketTotals
  );
  basketTotal$ = this.basketTotalSource.asObservable();
  paymentProcessed: boolean;

  constructor(private http: HttpClient) {}

  createPaymentIntent()

   {
    return this.http.post<IBasket>(`${this.baseUrl}payments/${this.getCurrentBasketValue().id}`, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue );

        }),
        catchError((error: any) => {
          console.error('Error creating payment intent:', error);
          throw error;
        })
      );
  }



  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    const basket = this.getCurrentBasketValue();
    if (basket && basket.items) {
      this.shipp = deliveryMethod.price;
      basket.deliveryMethodId = deliveryMethod.id;
      this.calculateTotals();
      this.setBasket(basket);
    } else {
      this.basketTotalSource.next(this.initialBasketTotals);
    }
  }


  getNumberOfBasketItem() {
    return this.itemsQuantity;
  }

  getBasket(id: string) {
    return this.http
      .get<IBasket>(`${this.baseUrl}Basket/GetBasketById?id=${id}`)
      .pipe(
        map((basket: IBasket) => {
          // Update the basket source with the retrieved basket data
          this.basketSource.next(basket);
          this.calculateTotals();
        })
      );
  }

  // Update the user's basket
  setBasket(basket: IBasket) {
   console.log('Request Payload:', basket);
    this.http
      .post<IBasket>(`${this.baseUrl}basket/update-basket`, basket)
      .subscribe({
        next: (response) => {
          // Update the basket source with the response data
          this.basketSource.next(response);

          this.calculateTotals();
        },
        error: (error) => {
          console.error('Error updating basket:', error);
        },
      });
  }

  // Get the current basket value
  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }

  // Add an item to the user's basket
  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    console.log(item);

    // Get the current user's basket or create a new one if it doesn't exist
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    // Add or update the item in the basket
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    // Update the user's basket
    this.setBasket(basket);
  }

  // Add or update an item in the basket

  addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex((i) => i.id === itemToAdd.id);

    if (index === -1) {
      // If the item is not in the basket, add it with the given quantity
      itemToAdd.quantity = quantity;

      this.itemsQuantity = itemToAdd.quantity;

      items.push(itemToAdd);
    } else {
      // If the item is already in the basket, update its quantity
      items[index].quantity = quantity;
    }

    return items;
  }

  // Create a new basket and store its ID in local storage
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  createAndInitializeBasket() {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    this.basketSource.next(basket);
    this.calculateTotals();
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some((x) => x.id === item.id)) {
      basket.items = basket.items.filter((i) => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: Basket) {
    return this.http
      .delete(`${this.baseUrl}Basket/DeleteBasket?id=${basket.id}`)
      .subscribe({
        next: () => {
          this.basketSource.next(null);
          this.basketTotalSource.next(null);
          localStorage.removeItem('basket_id');
          if (basket.items.length === 0) {
            this.basketSource.next(this.emptyBasket);
            this.basketTotalSource.next(this.initialBasketTotals);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();

    if (!basket || !basket.items) {
      console.error('Basket or items are null or undefined');
      return;
    }

    const shipping = this.shipp;
    const discountRate = 0.05;
    const taxRate = 0.16;

    const subtotal = basket.items.reduce(
      (sum, value) => value.price * value.quantity + sum,
      0
    );

    const amountBeforeTaxAndDiscount = subtotal + shipping;
    const amountAfterDiscount = amountBeforeTaxAndDiscount - amountBeforeTaxAndDiscount * discountRate;
    const total = amountAfterDiscount + amountAfterDiscount * taxRate;

    // Round the total to 2 decimal places
    const roundedTotal = Math.round(total * 100) / 100;

    this.basketTotalSource.next({
      shipping,
      discount: discountRate,
      total: roundedTotal,
      subtotal,
      tax: taxRate,
    });
  }


  // Map a product item to a basket item
  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }

  removeAllItemsFromBasket() {
    const basket = this.getCurrentBasketValue();
    if (basket.items.length > 0) {
      basket.items = []; // Clear the items array
      this.setBasket(basket); // Update the basket
    }
  }

  resetBasketState() {
    // Reset basket to an empty state
    const emptyBasket: IBasket = new Basket();
    this.basketSource.next(emptyBasket);

    // Reset basket totals to initial values
    this.basketTotalSource.next(this.initialBasketTotals);

    // Reset items quantity
    this.itemsQuantity = 0;

    // Optionally, you can also clear the local storage if needed
    localStorage.removeItem('basket_id');



   this.paymentProcessed = true;
  }




}
