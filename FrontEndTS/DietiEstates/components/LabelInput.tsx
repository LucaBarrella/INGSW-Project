import React from 'react';
import { TextInput } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export type LabelInputProps = {
  type?: 'default' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  lightColor?: string;
  darkColor?: string;
  textColor?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  inputBackgroundColor?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  required?: boolean;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function LabelInput({ 
  type = 'default', 
  label,
  placeholder,
  lightColor,
  darkColor,
  textColor,
  value,
  onChangeText,
  className = '',
  inputBackgroundColor,
  autoCapitalize = 'none',
  keyboardType = 'default',
  required = false,
  ...rest
}: Readonly<LabelInputProps>) {
  
  const themeTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColors = textColor ?? themeTextColor;
  const borderColor = textColors;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const inputBackground = inputBackgroundColor ?? backgroundColor;

  let defaultLabel = '';
  let defaultPlaceholder = '';

  switch (type) {
    case 'password':
      defaultLabel = 'Password';
      defaultPlaceholder = 'Enter your password';
      break;
    case 'email':
      defaultLabel = 'Email';
      defaultPlaceholder = 'Enter your email';
      break;
    default:
      defaultLabel = 'Input';
      defaultPlaceholder = 'Enter your input';
      break;
  }

  const finalLabel = label ?? defaultLabel;
  const finalPlaceholder = placeholder ?? defaultPlaceholder;

  return (
    <ThemedView className={`mb-8 ${className}`} lightColor={backgroundColor} darkColor={backgroundColor}>
      <ThemedText lightColor={textColors} darkColor={textColors} className='mb-2'>
        {finalLabel}{required ? ' *' : ''}
      </ThemedText>
      <TextInput
        className={`border p-2 rounded-md min-h-[40px] min-w-[200px] w-full`}
        style={{ color: textColors, borderColor, backgroundColor: inputBackground }}
        placeholder={finalPlaceholder}
        placeholderTextColor={textColors + '80'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={type === 'password'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize} // Aggiungi questa linea
        {...rest}
      />
    </ThemedView>
  );
}
