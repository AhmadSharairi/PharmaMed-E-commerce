import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldExcludeLoading(request)) {
      return next.handle(request);
    }
    if(request.method === 'DELETE')
    {
      return next.handle(request);
    }

    this.totalRequests++;
    this.loadingService.setLoading(true);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error)),
      finalize(() => this.handleFinalize())
    );
  }

  private shouldExcludeLoading(request: HttpRequest<any>): boolean {
    return request.method === 'POST' && request.url.includes('orders') ||
           request.url.includes('email-exists');
  }


  private handleFinalize(): void {
    this.totalRequests--;

    if (this.totalRequests === 0) {
      this.loadingService.setLoading(false);
    }
  }
}
