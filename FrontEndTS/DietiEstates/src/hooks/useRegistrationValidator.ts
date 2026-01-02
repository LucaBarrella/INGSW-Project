export interface RegistrationValidation {
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}
 
export type ValidationErrors = RegistrationValidation;
 
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
 
export const useRegistrationValidator = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<ValidationErrors>({});
 
  const validateRegistration = (userData: RegistrationValidation): { isValid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
 
    if (!userData.name || userData.name.trim().length === 0) {
      newErrors.name = t('forms.errors.fillRequired');
      isValid = false;
    }

    if (!userData.username || userData.username.trim().length === 0) {
      newErrors.username = t('forms.errors.fillRequired');
      isValid = false;
    }

    if (!userData.surname || userData.surname.trim().length === 0) {
      newErrors.surname = t('forms.errors.fillRequired');
      isValid = false;
    }

    if (!userData.email || userData.email.trim().length === 0) {
      newErrors.email = t('forms.errors.fillRequired');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = t('forms.errors.invalidEmail');
      isValid = false;
    }
 
    if (!userData.password) {
      newErrors.password = t('forms.errors.fillRequired');
      isValid = false;
    } else {
      const pw = userData.password;
      const pwErrors: string[] = [];
 
      if (pw.length < 8) {
        pwErrors.push(t('forms.errors.passwordTooShort'));
      }
      if (!/[A-Z]/.test(pw)) {
        pwErrors.push(t('forms.errors.invalid.password'));
      }
      if (!/[a-z]/.test(pw)) {
        pwErrors.push(t('forms.errors.invalid.password'));
      }
      if (!/[0-9]/.test(pw)) {
        pwErrors.push(t('forms.errors.invalid.password'));
      }
      if (!/[@#$%^&+=]/.test(pw)) {
        pwErrors.push(t('forms.errors.invalid.password'));
      }
 
      if (pwErrors.length > 0) {
        newErrors.password = pwErrors.join('\n');
        isValid = false;
      }
    }
    
 
     setErrors(newErrors);
     return { isValid, errors: newErrors };
   };
 
  const resetValidationErrors = (field?: keyof RegistrationValidation) => {
    if (!field) {
      setErrors({});
      return;
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };
 
  return {
    validateRegistration,
    errors,
    resetValidationErrors, // Espongo funzione sicura per resettare errori (campo specifico o tutti)
  };
};