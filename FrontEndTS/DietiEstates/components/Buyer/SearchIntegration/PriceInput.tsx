import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  quickOptions?: number[];
}

/**
 * PriceInput component for entering price values with quick presets.
 */
export const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value,
  onChange,
  quickOptions = [],
}) => {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundMuted = useThemeColor({}, 'backgroundMuted');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const formatNumberWithDots = (num: number): string => {
    return num.toLocaleString('it-IT');
  };

  const handleTextChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText === '') {
      onChange(0);
      return;
    }
    const newValue = parseInt(cleanedText, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const handleQuickSelect = (opt: number) => {
    triggerHaptic();
    onChange(opt);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
      <View style={[styles.inputContainer, { backgroundColor: backgroundMuted }]}>
        <ThemedText style={[styles.currencySymbol, { color: textColor }]}>€</ThemedText>
        <TextInput
          value={formatNumberWithDots(value)}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          style={[styles.input, { color: textColor }]}
          placeholder="0"
          placeholderTextColor={textColor + '40'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  quickOptions: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});