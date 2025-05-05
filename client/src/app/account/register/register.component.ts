import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map, switchMap, timer } from 'rxjs';
import { ValidateFormHelper } from 'src/app/helper/ValidateFormHelper';
import { GenderType } from 'src/app/shared/models/GenderType';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  public showPassword = false;
  emailPattren: string = '^[\\w-\\.]{1,25}@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,6}$';
  emailExists: boolean = false;
  Gender = GenderType;

  ngOnInit() {
    this.createRegisterForm();
  }
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}
  createRegisterForm() {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(3),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(3),
        ],
      ],
      gender: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern(this.emailPattren)],
        [this.validateEmailNotTaken()],
      ],
      password: [
        '',
        [Validators.required, ValidateFormHelper.passwordPatternValidator],
      ],
    });
  }

  protected passwordMeetsCriteria(criteria: string): boolean {
    const password = this.registerForm.get('password').value;
    switch (criteria) {
      case 'length':
        return password.length >= 8;
      case 'uppercase':
        return /[A-Z]/.test(password);
      case 'lowercase':
        return /[a-z]/.test(password);
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

  emailClear() {
    if (this.registerForm.get('email').value) {
      this.registerForm.get('email').reset();
      this.registerForm.get('email').setValue('');
      this.emailExists = false;
    }
  }

  inputIsValid(controlName: string): boolean {
    return this.registerForm.get(controlName).valid;
  }

  clearFirstName() {
    if (this.registerForm.get('firstName').value) {
      this.registerForm.get('firstName').reset();
      this.registerForm.get('firstName').setValue('');
    }
  }

  clearLastName() {
    if (this.registerForm.get('lastName').value) {
      this.registerForm.get('lastName').reset();
      this.registerForm.get('lastName').setValue('');
    }
  }


  async onRegister() {
    if (this.registerForm.valid)
    {
      this.accountService.register(this.registerForm.value).subscribe({
        next: async () => {
          const successConfig = {
            icon: 'success',
            title: 'Register Successful!',
            text: 'Have fun shopping!',
          };
          console.log(this.registerForm.value); 
          this.showSweetAlert(successConfig);

          this.router.navigateByUrl('/shop');
        },
        error: (error) => {
          const errorConfig = {
            icon: 'error',
            title: 'Registration Error',
            text: 'Registration error. Please try again.',
          };

          this.showSweetAlert(errorConfig);
          console.error('Login error:', error);
        },
      });
    } else ValidateFormHelper.validateAllFormFields(this.registerForm);
  }

  public showSweetAlert(config: any) {
    const defaultConfig = {
      position: 'center',
      timer: 1500,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    };
    Swal.fire({ ...defaultConfig, ...config });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control) => {
      return timer(300).pipe(
        switchMap(() => {
          if (!control.value) {
            return null;
          }
          return this.accountService.checkEmailExist(control.value).pipe(
            map((res) => {
              this.emailExists = res;
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }
}