import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'] ,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ProgressSpinnerComponent {
  constructor(public loader: LoaderService) { }







}
