import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QuickNumericSelectorProps } from './types';

/**
 * QuickNumericSelector component for selecting numeric values.
 * Features quick presets and a modern stepper with haptic feedback.
 */
export const QuickNumericSelector: React.FC<QuickNumericSelectorProps> = ({
  label,
  value,
  onValueChange,
  maxValue = 10,
  minValue = 1,
  unit = "",
  presets = ["1", "2", "3"],
  showPresets = true
}) => {
  const [inputValue, setInputValue] = useState(value || minValue.toString());
  const [error, setError] = useState(false);

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");
  const backgroundMuted = useThemeColor({}, "backgroundMuted");
  const errorColor = useThemeColor({}, "visitStatusRejected");

  useEffect(() => {
    setInputValue(value || minValue.toString());
  }, [value, minValue]);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const handleQuickSelect = (selectedValue: string) => {
    triggerHaptic();
    setError(false);
    onValueChange(selectedValue);
  };

  const increment = () => {
    const current = parseInt(inputValue) || 0;
    if (current < maxValue) {
      triggerHaptic();
      const newValue = (current + 1).toString();
      setInputValue(newValue);
      onValueChange(newValue);
      setError(false);
    }
  };

  const decrement = () => {
    const current = parseInt(inputValue) || 0;
    if (current > minValue) {
      triggerHaptic();
      const newValue = (current - 1).toString();
      setInputValue(newValue);
      onValueChange(newValue);
      setError(false);
    }
  };

  const handleInputChange = (text: string) => {
    let numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setInputValue('');
      setError(true);
      return;
    }

    if (numericValue.length > 1 && numericValue.startsWith('0')) {
      numericValue = numericValue.replace(/^0+/, '');
      if (numericValue === '') numericValue = '0';
    }
    
    setInputValue(numericValue);
    const num = parseInt(numericValue, 10);

    if (!isNaN(num) && num >= minValue && num <= maxValue) {
      onValueChange(numericValue);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
      <View style={styles.controlsRow}>
        <View style={styles.presets}>
          {showPresets && presets.map((num) => {
            const isSelected = inputValue === num;
            return (
              <TouchableOpacity
                key={num}
                onPress={() => handleQuickSelect(num)}
                style={[
                  styles.presetButton,
                  {
                    backgroundColor: isSelected ? tintColor : backgroundMuted,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.presetText,
                    {
                      color: isSelected ? buttonTextColor : textColor,
                    },
                  ]}
                >
                  {`${num}${unit}`}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View 
          style={[
            styles.stepper, 
            { 
              backgroundColor: backgroundMuted,
              borderColor: error ? errorColor : 'transparent',
              borderWidth: error ? 1 : 0
            }
          ]}
        >
          <TouchableOpacity onPress={decrement} style={styles.stepperButton}>
            <Ionicons name="remove" size={20} color={textColor} />
          </TouchableOpacity>

          <TextInput
            value={inputValue}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            style={[styles.input, { color: textColor }]}
            placeholder="0"
            placeholderTextColor={textColor + '40'}
          />

          <TouchableOpacity onPress={increment} style={styles.stepperButton}>
            <Ionicons name="add" size={20} color={textColor} />
          </TouchableOpacity>
        </View>
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
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presets: {
    flexDirection: 'row',
    marginRight: 12,
  },
  presetButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 4,
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
});
