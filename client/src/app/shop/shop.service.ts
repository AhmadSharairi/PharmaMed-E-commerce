import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { IPagination, Pagination } from '../shared/models/Pagination';
import { IType } from '../shared/models/ProductTypes';
import { ShopParams } from './../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/Brand';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;

  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) {}

  getProducts(useCache: boolean): Observable<IPagination> {
    if (useCache == false) {
      this.products = [];
    }
    if (this.products.length > 0 && useCache === true) {
      const pagesRecived = Math.ceil(
        this.products.length / this.shopParams.pageNumItems
      );

      if (this.shopParams.pageNumber <= pagesRecived) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageNumItems,
          this.shopParams.pageNumber * this.shopParams.pageNumItems
        );
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandId != 0) {
      params = params.append(
        'brandId',
        this.shopParams.brandId.toString()
      );
    }

    if (this.shopParams.typeId != 0) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageNumItems.toString());
    params = params.append('sort', this.shopParams.sort);

    if (this.shopParams.search)
      params = params.append('search', this.shopParams.search);

    return this.http
      .get<IPagination>(this.baseUrl + 'products', { params })
      .pipe(
        tap((response) => {
          this.products = useCache
            ? [...this.products, ...response.data]
            : response.data;
          this.pagination = response;
        }),
        map(() => this.pagination)
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const products = this.products.find((p) => p.id === id);
    if (products) {
      return of(products);
    }
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(): Observable<IBrand[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }

    return this.http
      .get<IBrand[]>(this.baseUrl + 'products/brands')
      .pipe(
        map((response) => {
          this.brands = response;
          return response;
        })
      );
  }

  getTypes(): Observable<IType[]> {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map((response) => {
        this.types = response;
        return response;
      })
    );
  }
}
