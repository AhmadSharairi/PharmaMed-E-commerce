import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { Observable, map } from 'rxjs';
import { Order, OrderToCreate } from '../shared/models/order';
import { IAddress } from '../shared/models/address';
import { BasketService } from '../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  private formAddressData: IAddress;
  private formDeliveryId: number = null;

  constructor(
    private http: HttpClient,
    private basketService: BasketService,
    private toaster: ToastrService
  ) {}

  createOrder(order: OrderToCreate): Observable<Order> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Order>(
      `${this.baseUrl}Orders/Create-Order`,
      JSON.stringify(order),
      { headers }
    );
  }

  
  getDeliveryMethods() {
    return this.http
      .get<IDeliveryMethod[]>(this.baseUrl + 'Orders/DeliveryMethods')
      .pipe(
        map((dm: IDeliveryMethod[]) => {
          return dm.sort((a, b) => b.price - a.price); //Descending sort
        })
      );
  }

  setAddressFormData(address: IAddress) {
    if (address) {
      this.formAddressData = { ...address };
    } else {
      console.error('Invalid address');
    }
  }

  getAddressFormData(): IAddress {
    return this.formAddressData;
  }

  setDeliveryFormDataId(id: number): void {
    if (typeof id === 'number') {
      this.formDeliveryId = id;
    } else {
      console.error('Invalid id. Please provide a valid number.');
    }
  }

  getDeliveryIdFormData() {
    return this.formDeliveryId;
  }

  createPaymentIntent() {
    return this.basketService.createPaymentIntent().subscribe(
      (response: any) => {
        return response;
      },
      (error) => {
        console.log(error);
        return error;
      }
    );
  }
}
