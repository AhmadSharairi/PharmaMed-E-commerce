import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'] ,
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
export class LearnComponent {
  scrollOffset = 0;
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 300);

}


onScroll(event: Event): void {
  this.scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
}
