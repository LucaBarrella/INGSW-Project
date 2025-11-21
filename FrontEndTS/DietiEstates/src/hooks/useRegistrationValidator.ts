export interface RegistrationValidation {
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
}
 
export type ValidationErrors = RegistrationValidation;
 
import { useState } from 'react';
 
export const useRegistrationValidator = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
 
  const validateRegistration = (userData: RegistrationValidation): { isValid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
 
    if (!userData.name || userData.name.trim().length === 0) {
      newErrors.name = 'Il nome è obbligatorio';
      isValid = false;
    }

    if (!userData.username || userData.username.trim().length === 0) {
      newErrors.username = "L'username è obbligatorio";
      isValid = false;
    }

    if (!userData.surname || userData.surname.trim().length === 0) {
      newErrors.surname = 'Il cognome è obbligatorio';
      isValid = false;
    }

    if (!userData.email || userData.email.trim().length === 0) {
      newErrors.email = "L'email è obbligatoria";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
      isValid = false;
    }
 
    if (!userData.password) {
      newErrors.password = 'La password è obbligatoria';
      isValid = false;
    } else {
      const pw = userData.password;
      const pwErrors: string[] = [];
 
      if (pw.length < 8) {
        pwErrors.push('La password deve essere di almeno 8 caratteri');
      }
      if (!/[A-Z]/.test(pw)) {
        pwErrors.push('La password deve contenere almeno una lettera maiuscola');
      }
      if (!/[a-z]/.test(pw)) {
        pwErrors.push('La password deve contenere almeno una lettera minuscola');
      }
      if (!/[0-9]/.test(pw)) {
        pwErrors.push('La password deve contenere almeno un numero');
      }
      if (!/[@#$%^&+=]/.test(pw)) {
        pwErrors.push('La password deve contenere almeno un carattere speciale (@#$%^&+=)');
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