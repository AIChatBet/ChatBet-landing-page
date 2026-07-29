import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validationInstitucional(
  blacklistedDomains: string[],
  strictDotCom: boolean = false
): ValidatorFn {
  const blacklistedRoots = blacklistedDomains.map((domain) => domain.split('.')[0]);

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const email = control.value.toLowerCase().trim();
    const emailParts = email.split('@');

    if (emailParts.length !== 2 || !emailParts[1]) {
      return { invalidFormat: true };
    }

    const domain = emailParts[1];
    const domainRoot = domain.split('.')[0];

    // 1. Filtrar dominios de correo gratuito, incluyendo typos/variantes de TLD (Blacklist)
    if (blacklistedDomains.includes(domain) || blacklistedRoots.includes(domainRoot)) {
      return { forbiddenDomain: true };
    }

    // 2. Condición restrictiva: Solo permitir terminación .com
    if (strictDotCom && !domain.endsWith('.com')) {
      return { forbiddenDomain: true }; 
    }

    return null; 
  };
}
