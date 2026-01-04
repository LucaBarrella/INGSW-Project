import React from 'react';
import { View } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { t } from 'i18next';

interface Step2BasicDetailsProps {
  control: Control<any>;
  errors: FieldErrors;
}

export default function Step2_BasicDetails({ control, errors }: Step2BasicDetailsProps) {
  const tint = useThemeColor({}, 'tint');

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <ThemedView className="p-4 gap-6">
        {/* Header Section */}
        <View className="flex-row items-center gap-3 mb-2">
          <View className="p-2.5 rounded-full shadow-sm" style={{ backgroundColor: useThemeColor({}, 'background'), shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <ThemedIcon icon="material-symbols:description" size={26} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.details')} />
          </View>
          <View>
            <ThemedText type="subtitle" className="text-xl font-bold">{t('addProperty.headers.basicDetails')}</ThemedText>
            <ThemedText className="text-sm opacity-60">{t('addProperty.stepCounter', { current: 2, total: 5 })}</ThemedText>
          </View>
        </View>

        {/* Description Card */}
        <View
          className="p-5 rounded-3xl border"
          style={{
            backgroundColor: useThemeColor({}, 'background'),
            borderColor: useThemeColor({}, 'border'),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          <ThemedText className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1">{t('addProperty.labels.description')}</ThemedText>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <LabelInput
                label={t('addProperty.labels.propertyDescription')}
                placeholder={t('addProperty.placeholders.description')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={6}
                error={!!errors.description}
                errorMessage={errors.description?.message as string}
                className="mb-0"
              />
            )}
          />
        </View>

        {/* Price and Area Card */}
        <View
          className="p-5 rounded-3xl border"
          style={{
            backgroundColor: useThemeColor({}, 'background'),
            borderColor: useThemeColor({}, 'border'),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          <ThemedText className="mb-4 text-sm font-semibold opacity-50 uppercase tracking-wider ml-1">{t('addProperty.headers.economicInfo')}</ThemedText>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <LabelInput
                    label={t('addProperty.labels.price')}
                    placeholder={t('addProperty.placeholders.price')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    error={!!errors.price}
                    errorMessage={errors.price?.message as string}
                    className="mb-0"
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, onBlur, value } }) => (
                  <LabelInput
                    label={t('addProperty.labels.area')}
                    placeholder={t('addProperty.placeholders.area')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    error={!!errors.area}
                    errorMessage={errors.area?.message as string}
                    className="mb-0"
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ThemedView>
    </Animated.View>
  );
}