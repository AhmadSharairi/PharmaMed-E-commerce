import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Order } from '../shared/models/order';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'Orders/Get-Orders');
  }

  getOrderDetailed(id: number): Observable<Order>
  {
    return this.http.get<Order>(this.baseUrl + 'Orders/OrderIdForUser/' + id);
  }
}
