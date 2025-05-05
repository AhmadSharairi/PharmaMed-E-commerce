import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { IUser } from './../shared/models/user';
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
  getCurrentUser(){
    return this.currentUserSource.asObservable()
  }

  loadCurrentUser(token: string | null): Observable<IUser | null> {
    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(`${this.baseUrl}account/current-user`, { headers }).pipe(
      map((user) => {
        if (user && user.token) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user;
        } else {
          this.currentUserSource.next(null);
          return null;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading current user:', error);
        this.currentUserSource.next(null);
        return of(null);
      })
    );
  }
  login(values: any): Observable<void> {
    return this.http.post<IUser>(`${this.baseUrl}account/login`, values).pipe(
      map((user) => {
        if (user && user.token) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        } else {
          throw new Error('Unauthorized - User or token not found');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }


  register(values: any): Observable<void> {
    return this.http.post<IUser>(`${this.baseUrl}account/register`, values).pipe(
      map((user) => {
        if (user && user.token) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.router.navigateByUrl('/shop');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'Account/email-exists?email=' + email);
  }

  getUserAddress(): Observable<IAddress> {
    return this.http.get<IAddress>(this.baseUrl + 'Account/user-address')
  }

  updateUserAddress(address: IAddress): Observable<IAddress> {
    return this.http.put<IAddress>(this.baseUrl + 'Account/update-address', address).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving address:', error);
        return throwError(() => error);
      })
    );
  }
}
