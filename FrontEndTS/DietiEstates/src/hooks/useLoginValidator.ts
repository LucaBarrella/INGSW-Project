import { useState } from 'react';

export interface LoginValidation {
  email?: string;
  password?: string;
}

export type LoginValidationErrors = LoginValidation;

export const useLoginValidator = () => {
  const [errors, setErrors] = useState<LoginValidationErrors>({});

  const validateLogin = (credentials: { email: string; password: string }): { isValid: boolean; errors: LoginValidationErrors } => {
    const newErrors: LoginValidationErrors = {};
    let isValid = true;

    if (!credentials.email || credentials.email.trim().length === 0) {
      newErrors.email = "L'email è obbligatoria";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
      isValid = false;
    }

    if (!credentials.password || credentials.password.length === 0) {
      newErrors.password = 'La password è obbligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const resetValidationErrors = (field?: keyof LoginValidation) => {
    if (!field) {
      setErrors({});
      return;
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return {
    validateLogin,
    errors,
    resetValidationErrors,
  };
};