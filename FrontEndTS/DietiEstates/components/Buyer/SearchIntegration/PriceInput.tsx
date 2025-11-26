import React from 'react';
import { View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  quickOptions: number[];
}

const formatNumberWithDots = (num: number): string => {
  return num.toLocaleString('it-IT');
};

export const PriceInput: React.FC<PriceInputProps> = ({ label, value, onChange }) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'tabIconDefault');

  return (
    <View className="mb-6">
      <ThemedText className="text-base font-medium mb-4" style={{ color: textColor }}>
        {label}
      </ThemedText>
      <View className="flex-row items-center">
        <ThemedText style={{ color: textColor, marginRight: 8 }}>€</ThemedText>
        <TextInput
          value={formatNumberWithDots(value)}
          onChangeText={(text) => {
            const cleanedText = text.replace(/[^0-9]/g, ''); // Rimuovi tutti i caratteri non numerici
            if (cleanedText === '') {
              onChange(0);
              return;
            }
            const newValue = parseInt(cleanedText, 10);
            if (!isNaN(newValue)) {
              onChange(newValue);
            }
          }}
          keyboardType="numeric"
          className="flex-1 p-2 rounded-lg border"
          style={{ color: textColor, borderColor: backgroundColor }}
        />
      </View>
    </View>
  );
};