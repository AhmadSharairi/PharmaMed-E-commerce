import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from './../shop.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { NgxSpinnerService } from 'ngx-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: [
    trigger('fadeInSection', [
      transition(':enter', [
        style({ opacity: -1 }),
        animate('2s ease-in-out', style({ opacity: 3 })),
      ]),
    ]),
  ],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  basket$: Observable<IBasket>;
  discountValue: number; // The Value of DiscountValue Determine in shop.service
  discValue: number;
  price: number;
  discountPrice: number;
  initializeDiscountValue: boolean = false;
  quantity: number = 1;
  products: any[] = [];
  relatedProductsList: IProduct[] = [];


  constructor(
    private ShopService: ShopService,
    private activateRoute: ActivatedRoute,
    private bcService: BreadcrumbService,
    private spinner: NgxSpinnerService,
    private basketService: BasketService,
    private shopService: ShopService,
    private router: Router ,
    private route: ActivatedRoute
  ) {
    this.bcService.set('@productDetails', ' ');
  }

  ngOnInit() {
    //this to make when open the page  load the page from the top
    this.router.events.subscribe((event) =>
     {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    }
    );

    this.route.paramMap.subscribe(params => {
      // Reload the product details when the route parameters change
      this.loadProduct();
    });

  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe((response) => {
      this.products = response.data;


      if (this.product && this.product.productType) {
        this.relatedProductsList = this.products.filter(
          (p) => p.productType === this.product.productType && p.id !== this.product.id
        );
      }
    });
  }


  loadProduct() {
    this.spinner.show();
    this.ShopService.getProduct(
      +this.activateRoute.snapshot.paramMap.get('id')
    ).subscribe((product: IProduct) => {
      this.product = product;
      this.price = product.price;

      this.bcService.set('@productDetails', product.name);
      this.spinner.hide();
      this.getProducts(false);
    });
  }
  incrementQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addItemToBasket() {
    // Assuming this.quantity contains the user-selected quantity
    const quantity = this.quantity;

    this.basketService.addItemToBasket(this.product, quantity);

    Swal.fire({
      icon: 'success',
      title: 'Item Added to Basket',
      text: `You've added ${quantity} ${
        quantity === 1 ? 'item' : 'items'
      } to your basket.`,
      position: 'center',
      showConfirmButton: false,
      timer: 1300, // Automatically close after 1.8 seconds
    });
  }


}
