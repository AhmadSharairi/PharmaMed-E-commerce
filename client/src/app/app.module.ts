import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ContactModule } from './contact/contact.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { CheckoutModule } from './checkout/checkout.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { OrdersModule } from './orders/orders.module';
import { LearnComponent } from './Learn/learn/learn.component';


@NgModule({
  declarations: [AppComponent, LearnComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,
    CoreModule,
    SharedModule,
    HomeModule,
    ContactModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    CheckoutModule,
    OrdersModule,
    ToastrModule.forRoot(),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi: true},
    {provide: HTTP_INTERCEPTORS,useClass: LoadingInterceptor,multi: true},
    {provide: HTTP_INTERCEPTORS,useClass: JwtInterceptor,multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {




}
