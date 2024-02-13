import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';


@Component({
  selector: 'section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})

//Run npm install --save xng-breadcrumb ,  to use Component correctlly
export class SectionHeaderComponent implements OnInit {
  breadcrumb$: Observable<any[]>

constructor(private bcService : BreadcrumbService) {}

  ngOnInit() {
  this.breadcrumb$ = this.bcService.breadcrumbs$;
  }



  shouldDisplayBreadcrumb(breadcrumbs: any[] | undefined): boolean {
    return breadcrumbs && breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1].label !== 'Home';
  }

  getLastBreadcrumbLabel(breadcrumbs: any[] | undefined): string {
    return breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : '';
  }

}
