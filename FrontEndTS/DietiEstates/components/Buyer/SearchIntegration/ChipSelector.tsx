import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

interface ChipSelectorProps<T extends string> {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (value: T | null) => void;
  multiSelect?: boolean;
  selectedValues?: T[];
  onMultiChange?: (values: T[]) => void;
}

/**
 * ChipSelector component for selecting options using chips.
 * Supports single and multiple selection.
 *
 * @param options - Array of options with label and value.
 * @param value - Currently selected value (for single select).
 * @param onChange - Callback when value changes (for single select).
 * @param multiSelect - Whether multiple selection is enabled.
 * @param selectedValues - Array of currently selected values (for multi select).
 * @param onMultiChange - Callback when selected values change (for multi select).
 */
export function ChipSelector<T extends string>({
  options,
  value,
  onChange,
  multiSelect = false,
  selectedValues = [],
  onMultiChange,
}: ChipSelectorProps<T>) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const backgroundMuted = useThemeColor({}, "backgroundMuted");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");

  const isSelected = (val: T) => {
    if (multiSelect) {
      return selectedValues.includes(val);
    }
    return value === val;
  };

  const handlePress = (val: T) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}

    if (multiSelect) {
      const nextValues = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      onMultiChange?.(nextValues);
    } else {
      onChange(value === val ? null : val);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = isSelected(option.value);
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const onPressIn = () => {
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
          }).start();
        };

        const onPressOut = () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        };

        return (
          <Animated.View
            key={option.value}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => handlePress(option.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? tintColor : backgroundMuted,
                  borderColor: selected ? tintColor : textColor + '10',
                },
              ]}
            >
            <ThemedText
              style={[
                styles.label,
                { color: selected ? buttonTextColor : textColor },
              ]}
            >
              {option.label}
            </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});