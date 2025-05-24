import React from 'react';
import { TextInput, NativeSyntheticEvent, TextInputFocusEventData, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native'; // Import necessary types
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define LabelInputProps based on the read file structure
// Rimuoviamo onBlur che causava problemi
export type LabelInputProps = {
  type?: 'default' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  lightColor?: string;
  darkColor?: string;
  textColor?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void; // Reintrodotto onBlur
  className?: string;
  inputBackgroundColor?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: TextInputProps['keyboardType']; // Use TextInputProps['keyboardType'] for better type safety
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>; // Use StyleProp<ViewStyle> for the container
  inputStyle?: StyleProp<TextStyle>;
  error?: boolean; // Indica se c'è un errore
  errorMessage?: string; // Messaggio di errore da visualizzare
} & Omit<TextInputProps, 'style' | 'onChangeText' | 'value' | 'placeholder' | 'keyboardType' | 'autoCapitalize' | 'multiline' | 'numberOfLines' | 'secureTextEntry' | 'onBlur'>;

// Removed capitalizeFirstLetter function as it wasn't used in the return statement

export function LabelInput({
  type = 'default',
  label,
  placeholder,
  lightColor,
  darkColor,
  textColor,
  value,
  onChangeText,
  onBlur, // Reintrodotto onBlur
  className = '',
  inputBackgroundColor,
  autoCapitalize = 'none',
  keyboardType = 'default',
  required = false,
  multiline = false,
  numberOfLines,
  style, // Destructure container style
  inputStyle,
  error,
  errorMessage, // Destructure errorMessage
  ...rest
}: LabelInputProps) {

  const themeTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColors = textColor ?? themeTextColor;
  const themeBorderColor = useThemeColor({}, 'border');
  const themeErrorColor = useThemeColor({}, 'error'); // Usa il colore di errore dal tema
  const borderColor = error ? themeErrorColor : themeBorderColor; // Usa colore errore dal tema
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const inputBackground = inputBackgroundColor ?? backgroundColor;
  const placeholderColor = textColors + '80'; // Usa il colore del testo con opacità 50%

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
      keyboardType = 'email-address'; // Set keyboardType for email
      break;
    default:
      defaultLabel = 'Input';
      defaultPlaceholder = 'Enter your input';
      break;
  }

  const finalLabel = label ?? defaultLabel;
  const finalPlaceholder = placeholder ?? defaultPlaceholder;

  return (
    // Ripristinato ThemedView e className come nella versione funzionante
    <ThemedView className={`mb-8 ${className}`} style={style} lightColor={backgroundColor} darkColor={backgroundColor}>
       <ThemedText lightColor={textColors} darkColor={textColors} className='mb-2'>
         {/* Usiamo il template literal che dovrebbe essere sicuro */}
         {`${finalLabel}${required ? ' *' : ''}`}
       </ThemedText>
       <TextInput
         // Ripristinato className e stile combinato
         className={`border p-2 rounded-md min-h-[40px] w-full`}
         style={[
           {
             color: textColors,
             borderColor: borderColor, // Applica bordo dinamico
             backgroundColor: inputBackground
           },
           multiline && { textAlignVertical: 'top', height: numberOfLines ? undefined : 80 }, // Stili multiline
           inputStyle // Applica inputStyle custom
         ]}
         placeholder={finalPlaceholder}
         placeholderTextColor={placeholderColor}
         value={value}
         onChangeText={onChangeText}
         onBlur={onBlur} // Reintrodotto onBlur
         secureTextEntry={type === 'password'}
         keyboardType={keyboardType}
         autoCapitalize={autoCapitalize}
         multiline={multiline}
         numberOfLines={numberOfLines}
         {...rest}
       />
       {/* Visualizza il messaggio di errore se presente */}
       {error && errorMessage && (
         <ThemedText style={{ color: themeErrorColor, marginTop: 4, fontSize: 12 }}>
           {errorMessage}
         </ThemedText>
       )}
     </ThemedView>
 );
}
