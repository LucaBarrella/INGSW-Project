import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { QuickNumericSelectorProps } from './types';

export const QuickNumericSelector: React.FC<QuickNumericSelectorProps> = ({
  label,
  value,
  onValueChange,
  maxValue = 10,
  minValue = 1,
  unit = ""
}) => {
  const [inputValue, setInputValue] = useState(value || '1');
  const [error, setError] = useState(false);

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");
  const backgroundColor = useThemeColor({}, "loginCardBackground");
  const errorColor = useThemeColor({}, "visitStatusRejected");
  const labelColor = useThemeColor({}, "tabIconDefault");

  const quickValues = ["1", "2", "3"];

  useEffect(() => {
    setInputValue(value || '1');
  }, [value]);

  const handleQuickSelect = (selectedValue: string) => {
    setError(false);
    onValueChange(selectedValue);
  };

  const increment = () => {
    const current = parseInt(inputValue) || 0;
    if (current < maxValue) {
      const newValue = (current + 1).toString();
      setInputValue(newValue);
      onValueChange(newValue);
      setError(false);
    }
  };

  const decrement = () => {
    const current = parseInt(inputValue) || 0;
    if (current > minValue) {
      const newValue = (current - 1).toString();
      setInputValue(newValue);
      onValueChange(newValue);
      setError(false);
    }
  };

  const handleInputChange = (text: string) => {
    // Rimuove caratteri non numerici
    let numericValue = text.replace(/[^0-9]/g, '');

    // Se l'input è vuoto, gestisci come errore o valore minimo a seconda della logica desiderata
    if (numericValue === '') {
      setInputValue(''); // o gestisci diversamente, es. minValue.toString()
      setError(true); // Potrebbe essere necessario un messaggio di errore specifico
      // onValueChange(''); // O il valore che rappresenta "nessun input"
      return;
    }

    // Rimuovi gli zeri iniziali se il numero non è solo "0"
    if (numericValue.length > 1 && numericValue.startsWith('0')) {
      numericValue = numericValue.replace(/^0+/, '');
      if (numericValue === '') numericValue = '0'; // Se dopo la rimozione è vuoto, era "00", quindi reimposta a "0"
    }
    
    setInputValue(numericValue);
    const num = parseInt(numericValue, 10);

    if (!isNaN(num) && num >= minValue && num <= maxValue) {
      onValueChange(numericValue); // Invia il valore stringa pulito
      setError(false);
    } else {
      // Se il valore parziale (es. utente sta scrivendo) è valido ma non completo,
      // potresti non voler settare errore subito, oppure sì se supera maxValue.
      // Per ora, manteniamo la logica di errore se fuori range.
      setError(true);
    }
  };

  const renderQuickButton = (num: string) => (
    <TouchableOpacity
      key={num}
      onPress={() => handleQuickSelect(num)}
      className={`px-4 py-2 rounded-lg mr-2`}
      style={{
        backgroundColor: inputValue === num ? buttonBackground : backgroundColor,
      }}
    >
      <ThemedText
        style={{
          color: inputValue === num ? buttonTextColor : textColor,
        }}
      >
        {`${num}${unit}`}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView className="mb-4">
      <ThemedText 
        className="text-sm mb-1"
        style={{ color: textColor }}
      >
        {label}
      </ThemedText>
      <View className="flex-row items-center">
        {quickValues.map(renderQuickButton)}
        <View 
          className="flex-row items-center rounded-lg"
          style={{ 
            backgroundColor,
            borderWidth: 1,
            borderColor: error ? errorColor : tintColor,
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={decrement}
            className="px-3 py-2 border-r"
            style={{ borderColor: error ? errorColor : tintColor }}
          >
            <Ionicons name="remove" size={16} color={textColor} />
          </TouchableOpacity>
          <View className="flex-row items-center flex-1">
            <TextInput
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              className="flex-1 text-center py-1"
              style={{ color: textColor }}
              maxLength={4}
            />
            {unit && (
              <ThemedText 
                className="pr-2"
                style={{ color: labelColor }}
              >
                {unit}
              </ThemedText>
            )}
          </View>
          <TouchableOpacity
            onPress={increment}
            className="px-3 py-2 border-l"
            style={{ borderColor: error ? errorColor : tintColor }}
          >
            <Ionicons name="add" size={16} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>
      {error && (
        <ThemedText 
          className="text-xs mt-1" 
          style={{ color: errorColor }}
        >
          {`Inserire un valore tra ${minValue} e ${maxValue}${unit}`}
        </ThemedText>
      )}
    </ThemedView>
  );
};
