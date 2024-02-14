import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { IUser } from './../shared/models/user';
import { IAddress } from '../shared/models/address';





@Injectable({
  providedIn: 'root',
})
export class AccountService {
   baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
   currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}



getCurrentUser(){
  return this.currentUserSource.asObservable()
}


loadCurrentUser(token: string) {
if (token === null)
{
  this.currentUserSource.next(null);
  return of(null);
}

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'Account/current-user', { headers }).pipe(
      map((user:IUser | any) => {
        if(user)
        {
          localStorage.setItem('token' , user.token);
          this.currentUserSource.next(user);

        }
        else
        if(!user)
        {
          this.currentUserSource.complete();

        }


      })
    );

  }




  login(values: any): Observable<void> {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user && user.token) {
          // Store the user's token in local storage.
          localStorage.setItem('token', user.token);

          // Update the current user source.
          this.currentUserSource.next(user);
        }
        else
        {
               throw new Error('Unauthorized - User or token not found');
        }

      })
    );
  }

  register(values: any) {
    return this.http
      .post<IUser>(this.baseUrl + 'Account/Register', values)
      .pipe(
        map((user: IUser) => {
          if (user)
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.router.navigateByUrl('/shop');
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
  }


  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'Account/email-exists?email=' + email);
  }


  getUserAddress(){
    return this.http.get<IAddress>(this.baseUrl + 'Account/user-address')
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'Account/update-address', address)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error saving address:', error);
          throw error;
        })
      );
  }



}
