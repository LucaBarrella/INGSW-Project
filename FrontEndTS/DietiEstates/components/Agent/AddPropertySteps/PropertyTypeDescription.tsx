import React from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { PropertyType } from './Step1_PropertyType';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface PropertyTypeDescriptionProps {
  selectedType: PropertyType | null;
}

const icons: Record<PropertyType, string> = {
  RESIDENTIAL: 'material-symbols:home-outline',
  COMMERCIAL: 'material-symbols:business-center-outline',
  GARAGE: 'material-symbols:garage-outline',
  LAND: 'material-symbols:landscape-outline',
};

import { t } from 'i18next';

export default function PropertyTypeDescription({ selectedType }: PropertyTypeDescriptionProps) {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1E293B' }, 'background');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  if (!selectedType) return null;

  const title = t(`addProperty.typeDescriptions.${selectedType}.title`);
  const desc = t(`addProperty.typeDescriptions.${selectedType}.desc`);
  const icon = icons[selectedType];

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      <ThemedView
        className="mt-8 p-5 rounded-3xl border-2 shadow-sm flex-row items-center gap-4"
        style={{ backgroundColor: cardBg, borderColor: tint + '20' }}
      >
        <View className="p-3 rounded-2xl" style={{ backgroundColor: tint + '15' }}>
          <ThemedIcon icon={icon} size={28} lightColor={tint} darkColor={tint} accessibilityLabel={title} />
        </View>
        <View className="flex-1">
          <ThemedText type="defaultSemiBold" className="text-lg" style={{ color: tint }}>
            {title}
          </ThemedText>
          <ThemedText className="text-sm opacity-70" style={{ color: textColor }}>
            {desc}
          </ThemedText>
        </View>
      </ThemedView>
    </Animated.View>
  );
}