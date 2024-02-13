import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { ShopParams } from '../shared/models/shopParams';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
}
)
export class ShopComponent {
  @ViewChild('search') searchTerm?: ElementRef;
  private unsubscribe$: Subject<void> = new Subject<void>();
  scrollOffset = 0;
  products: any[] = [];
  brands: any[] = [];
  types: any[] = [];

  loadingFinished = false;

  brandIdSelected = 0;
  typeIdSelected = 0;

  sortSelected = 'name';
  totalCountProducts = 0;

  shopParams: ShopParams;

  sortOptions = [
    { name: 'Alphabetical ', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  title = 'PharmaMed';

  constructor(
    private shopService: ShopService,
    private spinner: NgxSpinnerService ,
    private router: Router ,
    private renderer: Renderer2
  ) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit() {
    //this to make when open the page  load the page from the top
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(500, 0);
      }
    });

    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onScroll(event: Event): void {
    this.scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  getProducts(useCache = false) {
    // Start the spinner when fetching products
    this.startSpinner();

    this.shopService.getProducts(useCache).subscribe((response) => {
      this.products = response.data;
      this.totalCountProducts = response.count;
      this.loadingFinished = true;
      window.scrollTo({ top: 320, behavior: 'smooth' });
      // Stop the spinner when products are loaded
      this.stopSpinner();

      this.spinner.hide();
    });
  }

  getBrands() {
    this.spinner.show();
    this.shopService.getBrands().subscribe((response) => {
      this.brands = [{ id: 0, name: 'All' }, ...response];
      this.onBrandSelected(this.brandIdSelected);
      this.spinner.hide();
    });
  }

  getTypes() {
    this.spinner.show();
    this.shopService.getTypes().subscribe((response) => {
      this.types = [{ id: 0, name: 'All' }, ...response];
      this.onTypeSelected(this.typeIdSelected);
      this.spinner.hide();
    });
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();

    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);

      // Scroll to the top of the page
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  }


  onSearch() {
    const params = this.shopService.getShopParams();
    if (this.searchTerm && this.searchTerm.nativeElement) {
      params.search = this.searchTerm.nativeElement.value;
      params.pageNumber = 1;
      this.shopService.setShopParams(params);
      this.getProducts();
    }
  }

  onReset() {
    if (this.searchTerm) {
      this.searchTerm.nativeElement.value = '';
    }
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  startSpinner() {
    this.renderer.addClass(document.body, 'spinner-active');
  }

  // When you stop the spinner
  stopSpinner() {
    this.renderer.removeClass(document.body, 'spinner-active');
  }


}
