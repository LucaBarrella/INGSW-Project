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

// Define ListingType
export type ListingType = 'SALE' | 'RENT';

// Define props
interface ListingTypeSelectorProps {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  errors: FieldErrors;
}

const listingTypes: { type: ListingType; label: string }[] = [
  { type: 'SALE', label: 'In Vendita' },
  { type: 'RENT', label: 'In Affitto' },
];

// Componente Ripple Pressable con NativeWind
const RipplePressable = ({ type, label, isSelected, onChange, colors }: any) => {
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const rippleX = useSharedValue(0);
  const rippleY = useSharedValue(0);
  const containerRef = useAnimatedRef<Animated.View>(); // Use Animated.View ref

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      const measured = measure(containerRef);
      if (measured) {
        const diameter = Math.max(measured.width, measured.height) * 1.5;
        rippleX.value = event.x - diameter / 2;
        rippleY.value = event.y - diameter / 2;
        rippleScale.value = 0;
        rippleOpacity.value = 0.5;
        rippleScale.value = withTiming(1, { duration: 500 });
        rippleOpacity.value = withTiming(0, { duration: 400 });
      }
    })
    .onEnd(() => {
      runOnJS(onChange)(type);
    });

  const rippleStyle = useAnimatedStyle(() => {
    const diameter = 100; // Potrebbe essere calcolato dinamicamente se necessario
    return {
      position: 'absolute',
      left: rippleX.value,
      top: rippleY.value,
      width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      backgroundColor: colors.ripple, // Colore del ripple
      opacity: rippleOpacity.value,
      transform: [{ scale: rippleScale.value }],
    };
  });

  // Classi NativeWind per il contenitore
  const containerClasses = `
    flex-1 py-3 px-4 rounded-xl border-2 items-center justify-center
    active:scale-98 active:opacity-80 transition-all duration-150
  `;
  // Classi NativeWind per il testo
  const textClasses = `
    text-center font-medium text-base z-10
  `; // zIndex per tenere il testo sopra il ripple

  return (
    <GestureDetector gesture={tapGesture}>
      {/* Usiamo Animated.View per poter misurare con measure */}
      <Animated.View
        ref={containerRef}
        className={containerClasses}
        // Applichiamo colori e overflow con lo stile inline
        style={[
          {
            backgroundColor: isSelected ? colors.cardSelected : colors.background,
            borderColor: isSelected ? colors.cardBorderSelected : colors.border,
          },
          styles.overflowHidden // Stile per overflow: 'hidden'
        ]}
      >
        <ThemedText
          className={textClasses}
          style={{ color: isSelected ? colors.tint : colors.text }} // Usa colors.tint per il testo selezionato
        >
          {label}
        </ThemedText>
        <Animated.View style={rippleStyle} />
      </Animated.View>
    </GestureDetector>
  );
};


export default function ListingTypeSelector({ control, name, rules, errors }: ListingTypeSelectorProps) {
  // Centralizzazione dei colori
  const colors = {
    background: useThemeColor({}, 'background'),
    tint: useThemeColor({}, 'tint'), // Usiamo 'tint' come colore primario
    border: useThemeColor({}, 'border'),
    text: useThemeColor({}, 'text'),
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
      render={({ field: { onChange, value } }) => (
        // Usiamo NativeWind per il layout principale
        <ThemedView className="mb-6">
          <ThemedText type="defaultSemiBold" className="mb-3 text-base">
            Tipo di Annuncio
          </ThemedText>
          <View className="flex-row justify-between gap-4">
            {listingTypes.map((item) => {
              const isSelected = value === item.type;
              return (
                <RipplePressable
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  isSelected={isSelected}
                  onChange={onChange}
                  colors={colors}
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