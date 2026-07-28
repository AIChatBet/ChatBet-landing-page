import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validationInstitucional(
  blacklistedDomains: string[], 
  strictDotCom: boolean = false
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; 
    }

    const email = control.value.toLowerCase().trim();
    const emailParts = email.split('@');

    if (emailParts.length !== 2) {
      return { invalidFormat: true };
    }

    const domain = emailParts[1];

    // 1. Filtrar dominios de correo gratuito (Blacklist)
    if (blacklistedDomains.includes(domain)) {
      return { forbiddenDomain: true }; 
    }

    // 2. Condición restrictiva: Solo permitir terminación .com
    if (strictDotCom && !domain.endsWith('.com')) {
      return { forbiddenDomain: true }; 
    }

    return null; 
  };
}
