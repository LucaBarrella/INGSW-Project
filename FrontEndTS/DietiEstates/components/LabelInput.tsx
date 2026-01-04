import React, { useState } from 'react';
import { TextInput, NativeSyntheticEvent, TextInputFocusEventData, TextInputProps, StyleProp, ViewStyle, TextStyle, Animated } from 'react-native';
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
  onBlur,
  className = '',
  inputBackgroundColor,
  autoCapitalize = 'none',
  keyboardType = 'default',
  required = false,
  multiline = false,
  numberOfLines,
  style,
  inputStyle,
  error,
  errorMessage,
  ...rest
}: LabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const themeTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const textColors = textColor ?? themeTextColor;
  const themeBorderColor = useThemeColor({}, 'border');
  const themeErrorColor = useThemeColor({}, 'error');
  const themeTint = useThemeColor({}, 'tint');

  const borderColor = error
    ? themeErrorColor
    : isFocused
      ? themeTint
      : themeBorderColor;

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const inputBackground = inputBackgroundColor ?? backgroundColor;
  const placeholderColor = textColors + '60';

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
    <ThemedView className={`mb-6 ${className}`} style={[{ backgroundColor: 'transparent' }, style]} lightColor="transparent" darkColor="transparent">
      <ThemedText
        style={{
          color: error ? themeErrorColor : isFocused ? themeTint : textColors,
          fontWeight: isFocused ? '600' : '400',
          fontSize: 13,
          marginBottom: 6,
          marginLeft: 2
        }}
      >
        {finalLabel}
      </ThemedText>
      <TextInput
        className="border-2 p-3 rounded-xl w-full"
        style={[
          {
            color: textColors,
            borderColor: borderColor,
            backgroundColor: inputBackground,
            fontSize: 15,
            shadowColor: isFocused ? themeTint : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: isFocused ? 2 : 0,
          },
          multiline && { textAlignVertical: 'top', height: numberOfLines ? undefined : 100 },
          inputStyle
        ]}
        placeholder={finalPlaceholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        secureTextEntry={type === 'password'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...rest}
      />
      {error && errorMessage && (
        <Animated.View style={{ opacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) }}>
          <ThemedText style={{ color: themeErrorColor, marginTop: 6, fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
            {`⚠️ ${errorMessage}`}
          </ThemedText>
        </Animated.View>
      )}
    </ThemedView>
 );
}
