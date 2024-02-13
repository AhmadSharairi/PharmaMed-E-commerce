import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';

import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ValidateFormHelper } from 'src/app/helper/ValidateFormHelper';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public showPassword = false;
  returnUrl:any;


  emailPattren: string = '^[\\w-\\.]{1,25}@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}$';

  constructor(private accountService: AccountService, private router: Router , private activatedRoute: ActivatedRoute ) {}

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
    this.createLoginForm();
  }


  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.pattern(this.emailPattren),]),
      password: new FormControl('', [ Validators.required,ValidateFormHelper.passwordPatternValidator,
        
      ]),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: async () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          const errorConfig = {
            icon: 'error',
            title: 'Login Error',
            text: 'Login error. Please try again.',
          };

         this.showSweetAlert(errorConfig);
         this.router.navigateByUrl('account/login')
          console.error('Login error:', error);
        },
      });
    } else {
      ValidateFormHelper.validateAllFormFields(this.loginForm);
    }
  }

  public showSweetAlert(config: any) {
    const defaultConfig = {
      position: 'center',
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    };
    Swal.fire({ ...defaultConfig, ...config });
  }

  passwordMeetsCriteria(criteria: string ): boolean {
    const password = this.loginForm.get('password').value
    switch (criteria) {
      case 'length':
        return password.length >= 8;
      case 'uppercase':
        return /[A-Z]/.test(password);
      case 'number':
        return /\d/.test(password);
      case 'special':
        return /[@#$%^&*]/.test(password);
      default:
        return false;
    }
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  clearEmail() {
    if (this.loginForm.get('email').value) {
      this.loginForm.get('email').reset();
    }
  }
}
