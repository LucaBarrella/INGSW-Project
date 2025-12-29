import React from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (value: T | null) => void;
}

/**
 * SegmentedControl component with a macOS-style sliding indicator.
 * Provides a premium, high-contrast selection experience.
 */
export function SegmentedControl<T extends string>({ 
  options, 
  value, 
  onChange 
}: SegmentedControlProps<T>) {
  const backgroundMuted = useThemeColor({ light: '#E3E3E8', dark: '#1C1C1E' }, "backgroundMuted");
  const activeBg = useThemeColor({ light: '#1e3a8a', dark: '#D0E1F9' }, "buttonBackground");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const activeTextColor = useThemeColor({ light: '#EBF2FA', dark: '#050A16' }, "buttonTextColor");

  const selectedIndex = options.findIndex(opt => opt.value === value);

  const handlePress = (newValue: T) => {
    if (newValue !== value) {
      LayoutAnimation.configureNext({
        duration: 250,
        update: { type: 'spring', springDamping: 0.8 },
      });
      onChange(newValue);
    }
  };

  return (
    <View 
      style={[styles.container, { backgroundColor: backgroundMuted }]}
    >
      {/* Sliding Indicator Background */}
      {selectedIndex !== -1 && (
        <View
          style={[
            styles.indicatorContainer,
            {
              width: `${100 / options.length}%`,
              left: `${(selectedIndex * 100) / options.length}%`,
            }
          ]}
        >
          <View 
            style={[
              styles.indicator,
              { 
                backgroundColor: activeBg,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 2,
              }
            ]} 
          />
        </View>
      )}

      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => handlePress(option.value)}
          >
            <ThemedText
              style={{
                fontSize: 13,
                fontWeight: isSelected ? '700' : '600',
                color: isSelected ? activeTextColor : textColor,
                opacity: isSelected ? 1 : 0.6,
              }}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 12,
    position: 'relative',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    padding: 2,
  },
  indicator: {
    flex: 1,
    borderRadius: 10,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
