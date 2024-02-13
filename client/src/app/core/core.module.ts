import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { AboutComponent } from './about/about.component';
import { SharedModule } from '../shared/shared.module';






@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    AboutComponent

  ],

  providers:[],

  
  imports: [
     CommonModule,
     RouterModule,
     BreadcrumbModule,
     SharedModule,


    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

  ],

  exports: [NavBarComponent, FooterComponent, SectionHeaderComponent , AboutComponent ],
})
export class CoreModule {}
