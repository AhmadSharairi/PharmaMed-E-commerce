import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  scrollOffset = 0;

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);

    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll(event: Event): void {
    this.scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
}
