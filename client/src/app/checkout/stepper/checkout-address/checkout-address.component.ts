import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateFormHelper } from 'src/app/helper/ValidateFormHelper';
import { AccountService } from 'src/app/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from '../../checkout.service';


@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
})
export class CheckoutAddressComponent implements AfterViewInit {
  public stepAddressForm: FormGroup;
  loading: boolean;


  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService
  ) {}
  ngAfterViewInit() {
    this.loading = false;


  }

  ngOnInit() {
    this.createCheckoutForm();
    this.getAddreessFromValues();
  }

  createCheckoutForm() {
    this.stepAddressForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
      ],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      locationAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.pattern(/^\d{5}$/)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.stepAddressForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  public stepAddressSubmit() {
    if (this.stepAddressForm.valid) {
      this.checkoutService.setAddressFormData(this.stepAddressForm.value);
      window.scrollTo({ top: 120, behavior: 'smooth' });

    } else {
      ValidateFormHelper.validateAllFormFields(this.stepAddressForm);
    }
  }

  getAddreessFromValues() {
    this.accountService.getUserAddress().subscribe(
      (address) => {
        if (address) {
          this.stepAddressForm.patchValue(address);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveUserAddress() {

    try {
      // Update the user's address
      this.accountService
        .updateUserAddress(this.stepAddressForm.value)
        .subscribe({
          next: () => {
            this.toastr.success('Address saved');
            this.stepAddressForm.reset(this.stepAddressForm.value);
          },
          error: (err) => {
            console.error('Error saving address:', err);
            this.toastr.error('Error saving address. Please try again.');
          },
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      this.toastr.error('An unexpected error occurred. Please try again.');

    }
  }
}
