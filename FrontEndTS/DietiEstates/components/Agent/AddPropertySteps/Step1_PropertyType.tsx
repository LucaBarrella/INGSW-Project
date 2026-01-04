import React from 'react';
import { View } from 'react-native';
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CategoryButton } from '@/components/Buyer/CategoryButton';
import { t } from 'i18next';
import Animated, { FadeInRight } from 'react-native-reanimated';

export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'GARAGE' | 'LAND';

interface Step1PropertyTypeProps {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  errors: FieldErrors;
}

const propertyTypes: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'RESIDENTIAL', label: 'Residenziale', icon: 'material-symbols:home-outline' },
  { type: 'COMMERCIAL', label: 'Commerciale', icon: 'material-symbols:business-center-outline' },
  { type: 'GARAGE', label: 'Garage', icon: 'material-symbols:garage-outline' },
  { type: 'LAND', label: 'Terreno', icon: 'material-symbols:landscape-outline' },
];

export default function Step1_PropertyType({ control, name, rules, errors }: Step1PropertyTypeProps) {
  const errorColor = useThemeColor({ light: '#FF0000', dark: '#FF6B6B' }, 'error');
  const textColor = useThemeColor({}, 'propertyCardText');

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <ThemedView className="p-5 rounded-3xl border-2" style={{ backgroundColor: useThemeColor({}, 'propertyCardBackground'), borderColor: useThemeColor({}, 'border'), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 3 }}>
            <ThemedText type="defaultSemiBold" className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1" style={{ color: textColor }}>
              {t('addProperty.steps.step1')}
            </ThemedText>
            
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {propertyTypes.map(({ type, icon }) => {
                const isSelected = value === type;
                return (
                  <View key={type} className="w-[48%]">
                    <CategoryButton
                      icon={icon}
                      label={t(`property_category.${type.toLowerCase()}_property`)}
                      onPress={() => onChange(type)}
                      isSelected={isSelected}
                    />
                  </View>
                );
              })}
            </View>
            
            {errors[name] && (
              <ThemedText className="mt-4 text-sm font-medium" style={{ color: errorColor }}>
                ⚠️ {errors[name]?.message as string}
              </ThemedText>
            )}
          </ThemedView>
        )}
      />
    </Animated.View>
  );
}