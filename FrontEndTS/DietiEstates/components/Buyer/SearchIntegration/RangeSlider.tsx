import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Slider from "@react-native-community/slider";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from 'expo-haptics';
import type { RangeSliderProps } from "./types";

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `€${(value / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 1 })}M`;
  } else if (value >= 1000) {
    return `€${(value / 1000).toLocaleString('it-IT', { maximumFractionDigits: 0 })}K`;
  }
  return `€${value.toLocaleString('it-IT')}`;
};

/**
 * RangeSlider component for selecting a range of values.
 * Features a modern design with haptic feedback on interaction.
 */
export const RangeSlider: React.FC<RangeSliderProps> = ({
  title,
  value,
  onChange,
  type = "price",
  min = type === "price" ? 0 : 20,
  max = type === "price" ? 10000000 : 1000,
  step = type === "price" ? 50000 : 10,
  formatValue,
  unit = ""
}) => {
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "buttonBackground");
  const backgroundMuted = useThemeColor({}, "backgroundMuted");

  const initialDisplayValue = type === "price" ? value.max : value.min;
  const [tempValue, setTempValue] = useState(initialDisplayValue);

  useEffect(() => {
    setTempValue(initialDisplayValue);
  }, [value]);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const ensureInRange = (val: number): number => {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  };

  const defaultFormatValue = (val: number): string => {
    if (type === "price") {
      return formatCurrency(val);
    }
    return `${val}${unit}`;
  };

  const handleValueChange = (val: number) => {
    setTempValue(val);
    triggerHaptic();
  };

  const handleSlidingComplete = (val: number) => {
    const safeVal = ensureInRange(val);
    if (type === "price") {
      onChange({ min: 0, max: safeVal });
    } else if (type === "size") {
      onChange({ min: safeVal, max: value.max });
    } else {
      onChange({ min: safeVal, max: safeVal });
    }
  };

  const finalFormatValue = formatValue || defaultFormatValue;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
          {type === "price" && (
            <ThemedText style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
              Trascina per modificare
            </ThemedText>
          )}
        </View>
        <ThemedText style={[styles.valueDisplay, { color: tintColor }]}>
          {finalFormatValue(tempValue)}
        </ThemedText>
      </View>
      
      <View style={styles.sliderWrapper}>
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={tempValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={tintColor}
          maximumTrackTintColor={backgroundMuted}
          thumbTintColor={tintColor}
          style={styles.slider}
        />
      </View>
      
      <View style={styles.footer}>
        <ThemedText style={[styles.limitText, { color: textColor }]}>{finalFormatValue(min)}</ThemedText>
        <ThemedText style={[styles.limitText, { color: textColor }]}>{finalFormatValue(max)}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  valueDisplay: {
    fontSize: 15,
    fontWeight: '700',
  },
  sliderWrapper: {
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  limitText: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
  },
});
