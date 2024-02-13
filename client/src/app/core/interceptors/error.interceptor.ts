import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      delay(1000) ,
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine) {
          this.handleOfflineError();
        } else if (error instanceof HttpErrorResponse) {
          this.handleHttpError(error);
        } else {
          this.handleUnexpectedError();
        }

        return throwError(error);
      })
    );
  }

  private handleOfflineError(): void {
    this.toastr.error("You're offline. Please check your connection and try again later.", 'Error', {
      positionClass: 'toast-top-right'

    });
    this.router.navigateByUrl('/');
  }

  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 400:
      case 401:
      case 403:
        this.toastr.error(error.error.message, error.error.statusCode, { positionClass: 'toast-top-right' });


        break;
      case 404:
        this.router.navigateByUrl('/not-found');
        break;
      case 500:
        this.router.navigateByUrl('/server-error');
        break;
      default:
        this.toastr.error("Unexpected error. Retry later or contact support. Thank you.", 'Error', {
          positionClass: 'toast-top-right'
        });
        this.router.navigateByUrl('/');
        break;
    }
  }

  private handleUnexpectedError(): void {
    this.toastr.error("An unexpected error has occurred. Please try again later or contact support. Thank you!", 'Error', {
      positionClass: 'toast-top-right'
    });
    this.router.navigateByUrl('/');
  }
}
