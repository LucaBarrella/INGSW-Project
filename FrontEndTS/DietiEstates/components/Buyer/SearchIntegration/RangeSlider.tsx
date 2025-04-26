import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Slider from "@react-native-community/slider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withErrorBoundary } from "./ErrorBoundary";
import type { RangeSliderProps } from "./types";

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `€${(value / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 1 })}M`;
  } else if (value >= 1000) {
    return `€${(value / 1000).toLocaleString('it-IT', { maximumFractionDigits: 0 })}K`;
  }
  return `€${value.toLocaleString('it-IT')}`;
};

const RangeSliderComponent: React.FC<RangeSliderProps> = ({
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
  const backgroundColor = useThemeColor({}, "loginCardBackground");
  const tabIconDefault = useThemeColor({}, "tabIconDefault");

  // Assicuriamoci che displayValue sia sempre all'interno del range
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
    const safeVal = ensureInRange(val);
    if (type === "price") {
      onChange({ min: 0, max: safeVal });
    } else if (type === "size") {
      onChange({ min: safeVal, max: Infinity });
    } else {
      onChange({ min: safeVal, max: safeVal });
    }
  };

  const displayValue = ensureInRange(type === "price" ? value.max : value.min);
  const finalFormatValue = formatValue || defaultFormatValue;

  return (
    <ThemedView className="mb-6">
      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedView>
          <ThemedText
            className="text-base font-medium"
            style={{ color: textColor }}
          >
            {title}
          </ThemedText>
          {type === "price" && (
            <ThemedText
              className="text-xs mt-1"
              style={{ color: tabIconDefault }}
            >
              Trascina per modificare
            </ThemedText>
          )}
        </ThemedView>
        <ThemedText
          className="text-sm font-medium"
          style={{ color: textColor }}
        >
          {finalFormatValue(displayValue)}
        </ThemedText>
      </ThemedView>
      <ThemedView className="px-2">
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={displayValue}
          onValueChange={handleValueChange}
          minimumTrackTintColor={tintColor}
          maximumTrackTintColor={backgroundColor}
          thumbTintColor={tintColor}
          style={{ width: "100%", height: 40 }}
        />
        <ThemedView className="flex-row justify-between mt-1">
          <ThemedText 
            className="text-xs"
            style={{ color: tabIconDefault }}
          >
            {finalFormatValue(min)}
          </ThemedText>
          <ThemedText 
            className="text-xs"
            style={{ color: tabIconDefault }}
          >
            {finalFormatValue(max)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export const RangeSlider = withErrorBoundary<RangeSliderProps>(RangeSliderComponent, {
  onError: (error, errorInfo) => {
    console.error("RangeSlider Error:", error, errorInfo);
  },
  fallbackComponent: (
    <ThemedView className="p-4">
      <ThemedText className="text-red-500">
        Unable to load range slider. Please try again later.
      </ThemedText>
    </ThemedView>
  ),
});
