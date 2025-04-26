import React from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ 
  options, 
  value, 
  onChange 
}: SegmentedControlProps<T>) {
  const backgroundColor = useThemeColor({}, "loginCardBackground");
  const tintColor = useThemeColor({}, "buttonBackground");
  const textColor = useThemeColor({}, "text");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");

  const handlePress = (newValue: T) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(newValue);
  };

  return (
    <View 
      className="flex-row p-1 rounded-lg"
      style={{ backgroundColor }}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          className={`flex-1 py-2 ${index > 0 ? 'ml-1' : ''}`}
          style={[
            { 
              backgroundColor: value === option.value ? tintColor : 'transparent',
              borderRadius: 6
            }
          ]}
          onPress={() => handlePress(option.value)}
        >
          <ThemedText 
            className="text-center text-sm font-medium"
            style={{
              color: value === option.value ? buttonTextColor : textColor
            }}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
