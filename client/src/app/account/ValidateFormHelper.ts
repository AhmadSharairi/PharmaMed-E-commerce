import { FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";
export class ValidateFormHelper {

  loginFormValidate: FormGroup ;

constructor(){}

  static validateAllFormFields(formGroup: FormGroup)
   {
    Object.keys(formGroup.controls).
    forEach((field) => {
      const control = formGroup.get(field);

      if (control instanceof AbstractControl)
      {
        if (control instanceof FormGroup)
         {
          ValidateFormHelper.validateAllFormFields(control);
          }
          else
           {
          control.markAsDirty({ onlySelf: true });
        }
      }
    });
  }


  static passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password) {
      return null;
    }

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])[A-Za-z\d!@#$%^&*()_+}{":;'?/>.<,]{8,100}$/;


    if (!pattern.test(password)) {
      return { pattern: true };
    }

    return null;
  }

}


