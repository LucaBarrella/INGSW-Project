import React from 'react';
import { View, StyleSheet } from 'react-native'; // Import StyleSheet for overflow
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  measure,
  useAnimatedRef,
} from 'react-native-reanimated';
import { t } from 'i18next';
import { ThemedIcon } from '@/components/ThemedIcon';

// Define ListingType
export type ListingType = 'SALE' | 'RENT';

// Define props
interface ListingTypeSelectorProps {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  errors: FieldErrors;
}

const listingTypes: { type: ListingType; labelKey: string }[] = [
  { type: 'SALE', labelKey: 'filters.contract.options.SALE' },
  { type: 'RENT', labelKey: 'filters.contract.options.RENT' },
];

// Componente Ripple Pressable con NativeWind
const RipplePressable = ({ type, label, isSelected, onChange, colors, icon }: any) => {
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const containerRef = useAnimatedRef<Animated.View>();

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      const measured = measure(containerRef);
      if (measured) {
        const diameter = Math.max(measured.width, measured.height) * 2;
        rippleX.value = event.x - diameter / 2;
        rippleY.value = event.y - diameter / 2;
        rippleScale.value = 0;
        rippleOpacity.value = 0.3;
        rippleScale.value = withTiming(1, { duration: 400 });
        rippleOpacity.value = withTiming(0, { duration: 300 });
      }
    })
    .onEnd(() => {
      runOnJS(onChange)(type);
    });

  const rippleStyle = useAnimatedStyle(() => {
    const diameter = 200;
    return {
      position: 'absolute',
      left: rippleX.value,
      top: rippleY.value,
      width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      backgroundColor: isSelected ? colors.text : colors.tint,
      opacity: rippleOpacity.value,
      transform: [{ scale: rippleScale.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isSelected ? colors.tint : colors.background, { duration: 200 }),
      borderColor: withTiming(isSelected ? colors.tint : colors.border, { duration: 200 }),
      transform: [{ scale: withTiming(isSelected ? 1.02 : 1, { duration: 200 }) }],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        ref={containerRef}
        className="flex-1 py-4 px-4 rounded-2xl border-2 items-center justify-center shadow-sm"
        style={[animatedContainerStyle, styles.overflowHidden]}
      >
        <View className="flex-row items-center gap-2 z-10">
          <ThemedIcon
            icon={icon}
            size={20}
            lightColor={isSelected ? colors.background : colors.text}
            darkColor={isSelected ? colors.background : colors.text} accessibilityLabel={''}          />
          <ThemedText
            className="text-center font-bold text-base"
            style={{ color: isSelected ? colors.background : colors.text }}
          >
            {label}
          </ThemedText>
        </View>
        <Animated.View style={rippleStyle} />
      </Animated.View>
    </GestureDetector>
  );
};


export default function ListingTypeSelector({ control, name, rules, errors }: ListingTypeSelectorProps) {
  // Centralizzazione dei colori
  const colors = {
    background: useThemeColor({}, 'propertyCardBackground'),
    tint: useThemeColor({}, 'tint'), // Usiamo 'tint' come colore primario
    border: useThemeColor({}, 'border'),
    text: useThemeColor({}, 'propertyCardText'),
    // textPrimary: useThemeColor({}, 'tint'), // Usiamo 'tint' anche per il testo primario
    error: useThemeColor({ light: '#FF0000', dark: '#FF6B6B' }, 'error'), // Chiave 'error' valida
    // Usiamo valori specifici ma con una chiave valida ('tint') per useThemeColor
    cardSelected: useThemeColor({ light: '#E8F0FE', dark: '#1A365D' }, 'tint'),
    cardBorderSelected: useThemeColor({ light: '#4A90E2', dark: '#60A5FA' }, 'tint'),
    ripple: useThemeColor({ light: 'rgba(74, 144, 226, 0.3)', dark: 'rgba(96, 165, 250, 0.3)' }, 'tint'), // Chiave 'tint'
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, onBlur } }) => (
        // Usiamo NativeWind per il layout principale
        <ThemedView className="mb-6 p-5 rounded-3xl border-2" style={{ backgroundColor: colors.background, borderColor: colors.border, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 3 }}>
          <ThemedText type="defaultSemiBold" className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1" style={{ color: colors.text }}>
            {t('contractType')}
          </ThemedText>
          <View className="flex-row justify-between gap-4">
            {listingTypes.map((item) => {
              const isSelected = value === item.type;
              return (
                <RipplePressable
                  key={item.type}
                  type={item.type}
                  label={t(item.labelKey)}
                  isSelected={isSelected}
                  onChange={(val: any) => {
                    onChange(val);
                    onBlur(); // Notifica RHF del cambiamento
                  }}
                  colors={colors}
                  icon={item.type === 'SALE' ? 'material-symbols:sell' : 'material-symbols:key'}
                />
              );
            })}
          </View>
          {errors[name] && (
            <ThemedText className="mt-2 text-sm" style={{ color: colors.error }}>
              {errors[name]?.message as string}
            </ThemedText>
          )}
        </ThemedView>
      )}
    />
  );
}

// StyleSheet solo per overflow: 'hidden'
const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
});