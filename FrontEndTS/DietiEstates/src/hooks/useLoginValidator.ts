import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface LoginValidation {
  email?: string;
  password?: string;
}

export type LoginValidationErrors = LoginValidation;

export const useLoginValidator = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<LoginValidationErrors>({});

  const validateLogin = (credentials: { email: string; password: string }): { isValid: boolean; errors: LoginValidationErrors } => {
    const newErrors: LoginValidationErrors = {};
    let isValid = true;

    if (!credentials.email || credentials.email.trim().length === 0) {
      newErrors.email = t('forms.errors.fillRequired');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = t('forms.errors.invalidEmail');
      isValid = false;
    }

    if (!credentials.password || credentials.password.length === 0) {
      newErrors.password = t('forms.errors.fillRequired');
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