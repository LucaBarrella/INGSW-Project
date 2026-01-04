import React from 'react';
import { View, Switch, Pressable } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyType } from './Step1_PropertyType';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { t } from 'i18next';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Step4PropertyDetailsProps {
  control: Control<any>;
  errors: FieldErrors;
  propertyType: PropertyType | null;
}

const residentialCategories = ['Apartment', 'Villa', 'Penthouse', 'Townhouse'];
const commercialCategories = ['Office', 'Shop', 'Warehouse', 'Restaurant'];
const landCategories = ['Building Plot', 'Agricultural Land', 'Industrial Land'];
const garageCategories = ['Single Garage', 'Double Garage', 'Parking Space'];

export default function Step4_PropertyDetails({ control, errors, propertyType }: Step4PropertyDetailsProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const themeErrorColor = useThemeColor({}, 'error');

  // Rimosse regole locali, ora gestite da Zod

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <View className="flex-row items-center gap-2 mb-4 mt-2">
      <ThemedIcon icon={icon} size={20} lightColor={tint} darkColor={tint} accessibilityLabel={title} />
      <ThemedText type="defaultSemiBold" className="text-base" style={{ color: tint }}>{title}</ThemedText>
    </View>
  );

  const CustomSelect = ({ label, value, onPress, error, placeholder }: any) => (
    <View className="mb-4">
      <ThemedText className="mb-2 text-sm font-medium ml-1" style={{ color: textColor }}>{label}</ThemedText>
      <Pressable
        className="border-2 rounded-xl min-h-[50px] justify-center px-4"
        style={{
          borderColor: error ? themeErrorColor : borderColor,
          backgroundColor: backgroundColor
        }}
        onPress={onPress}
      >
        <View className="flex-row justify-between items-center">
          <ThemedText style={{ color: value ? textColor : textColor + '60' }}>
            {value ? t(value) : placeholder}
          </ThemedText>
          <ThemedIcon icon="material-symbols:keyboard-arrow-down-rounded" size={24} lightColor={textColor + '60'} darkColor={textColor + '60'} accessibilityLabel={t('addProperty.accessibility.open')} />
        </View>
      </Pressable>
      {error && <ThemedText className="mt-1 text-xs" style={{ color: themeErrorColor }}>{error.message}</ThemedText>}
    </View>
  );

  const CustomSwitch = ({ label, value, onChange }: any) => (
    <View className="flex-row justify-between items-center py-3 border-b" style={{ borderColor: borderColor + '20' }}>
      <ThemedText className="text-base">{label}</ThemedText>
      <Switch
        trackColor={{ false: borderColor, true: tint }}
        thumbColor={backgroundColor}
        ios_backgroundColor={borderColor}
        onValueChange={onChange}
        value={!!value}
      />
    </View>
  );

  const renderResidentialFields = () => (
    <>
      <Controller
        control={control}
        name="residentialCategory"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const options = [t('addProperty.placeholders.selectCategory'), ...residentialCategories.map(c => t(`property_category.sub.${c}`)), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.residentialCategory')}
              value={value ? `property_category.sub.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectCategory')}
              error={errors.residentialCategory}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(residentialCategories[i-1]);
                }
              })}
            />
          );
        }}
      />

      <SectionHeader title={t('addProperty.headers.spacesAndSurfaces')} icon="material-symbols:space-dashboard-outline" />
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Controller control={control} name="numberOfRooms" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.rooms')} placeholder={t('addProperty.placeholders.rooms')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfRooms} errorMessage={errors.numberOfRooms?.message as string} />
          )} />
        </View>
        <View className="flex-1">
          <Controller control={control} name="numberOfBathrooms" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.bathrooms')} placeholder={t('addProperty.placeholders.bathrooms')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfBathrooms} errorMessage={errors.numberOfBathrooms?.message as string} />
          )} />
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Controller control={control} name="floor" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.floor')} placeholder={t('addProperty.placeholders.floor')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.floor} errorMessage={errors.floor?.message as string} />
          )} />
        </View>
        <View className="flex-1">
          <Controller control={control} name="numberOfFloors" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.totalFloors')} placeholder={t('addProperty.placeholders.totalFloors')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfFloors} errorMessage={errors.numberOfFloors?.message as string} />
          )} />
        </View>
      </View>

      <SectionHeader title={t('addProperty.headers.featuresAndComfort')} icon="material-symbols:check-circle-outline" />
      <Controller
        control={control}
        name="garden"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const gardenTypes = ['PRIVATE', 'SHARED', 'ABSENT'];
          const options = [t('addProperty.placeholders.selectGardenType'), t('addProperty.enums.garden.PRIVATE'), t('addProperty.enums.garden.SHARED'), t('addProperty.enums.garden.ABSENT'), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.gardenType')}
              value={value ? `addProperty.enums.garden.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectGardenType')}
              error={errors.garden}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(gardenTypes[i-1]);
                }
              })}
            />
          );
        }}
      />

      <Controller
        control={control}
        name="heatingType"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const heatingTypes = ['Absent', 'Autonomous', 'Centralized'];
          const options = [t('addProperty.placeholders.selectHeatingType'), t('addProperty.enums.heating.Absent'), t('addProperty.enums.heating.Autonomous'), t('addProperty.enums.heating.Centralized'), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.heatingType')}
              value={value ? `addProperty.enums.heating.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectHeatingType')}
              error={errors.heatingType}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(heatingTypes[i-1]);
                }
              })}
            />
          );
        }}
      />

      <View className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl mt-2">
        <Controller control={control} name="hasElevator" render={({ field: { onChange, value } }) => (
          <CustomSwitch label={t('addProperty.labels.elevator')} value={value} onChange={onChange} />
        )} />
        <Controller control={control} name="isFurnished" render={({ field: { onChange, value } }) => (
          <CustomSwitch label={t('addProperty.labels.furnished')} value={value} onChange={onChange} />
        )} />
        <Controller control={control} name="yearBuilt" render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput label={t('addProperty.labels.yearBuilt')} placeholder={t('addProperty.placeholders.yearBuilt')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.yearBuilt} errorMessage={errors.yearBuilt?.message as string} />
        )} />
      </View>
    </>
  );

  const renderCommercialFields = () => (
    <>
      <Controller
        control={control}
        name="commercialCategory"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const options = [t('addProperty.placeholders.selectCategory'), ...commercialCategories.map(c => t(`property_category.sub.${c}`)), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.commercialCategory')}
              value={value ? `property_category.sub.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectCategory')}
              error={errors.commercialCategory}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(commercialCategories[i-1]);
                }
              })}
            />
          );
        }}
      />

      <SectionHeader title={t('addProperty.headers.spacesAndStructure')} icon="material-symbols:store-outline" />
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Controller control={control} name="numberOfRooms" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.rooms')} placeholder={t('addProperty.placeholders.rooms')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfRooms} errorMessage={errors.numberOfRooms?.message as string} />
          )} />
        </View>
        <View className="flex-1">
          <Controller control={control} name="numberOfBathrooms" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.bathrooms')} placeholder={t('addProperty.placeholders.bathrooms')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfBathrooms} errorMessage={errors.numberOfBathrooms?.message as string} />
          )} />
        </View>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Controller control={control} name="floor" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.floor')} placeholder={t('addProperty.placeholders.floor')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.floor} errorMessage={errors.floor?.message as string} />
          )} />
        </View>
        <View className="flex-1">
          <Controller control={control} name="numberOfFloors" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.totalFloors')} placeholder={t('addProperty.placeholders.totalFloors')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfFloors} errorMessage={errors.numberOfFloors?.message as string} />
          )} />
        </View>
      </View>

      <SectionHeader title={t('addProperty.headers.securityAndHistory')} icon="material-symbols:history-edu-outline" />
      <Controller control={control} name="yearBuilt" render={({ field: { onChange, onBlur, value } }) => (
        <LabelInput label={t('addProperty.labels.yearBuilt')} placeholder={t('addProperty.placeholders.yearBuilt')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.yearBuilt} errorMessage={errors.yearBuilt?.message as string} />
      )} />
      
      <View className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl mt-2">
        <Controller control={control} name="hasDisabledAccess" render={({ field: { onChange, value } }) => (
          <CustomSwitch label={t('addProperty.labels.disabledAccess')} value={value} onChange={onChange} />
        )} />
      </View>
    </>
  );

  const renderGarageFields = () => (
    <>
      <Controller
        control={control}
        name="garageCategory"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const options = [t('addProperty.placeholders.selectCategory'), ...garageCategories.map(c => t(`property_category.sub.${c}`)), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.garageCategory')}
              value={value ? `property_category.sub.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectCategory')}
              error={errors.garageCategory}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(garageCategories[i-1]);
                }
              })}
            />
          );
        }}
      />

      <SectionHeader title={t('addProperty.headers.structureDetails')} icon="material-symbols:garage-outline" />
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Controller control={control} name="floor" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.floor')} placeholder={t('addProperty.placeholders.floor')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.floor} errorMessage={errors.floor?.message as string} />
          )} />
        </View>
        <View className="flex-1">
          <Controller control={control} name="numberOfFloors" render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput label={t('addProperty.labels.totalFloors')} placeholder={t('addProperty.placeholders.totalFloors')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.numberOfFloors} errorMessage={errors.numberOfFloors?.message as string} />
          )} />
        </View>
      </View>

      <View className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl mt-2">
        <Controller control={control} name="hasSurveillance" render={({ field: { onChange, value } }) => (
          <CustomSwitch label={t('addProperty.labels.surveillance')} value={value} onChange={onChange} />
        )} />
        <Controller control={control} name="yearBuilt" render={({ field: { onChange, onBlur, value } }) => (
          <LabelInput label={t('addProperty.labels.yearBuilt')} placeholder={t('addProperty.placeholders.yearBuilt')} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="numeric" error={!!errors.yearBuilt} errorMessage={errors.yearBuilt?.message as string} />
        )} />
      </View>
    </>
  );

  const renderLandFields = () => (
    <>
      <Controller
        control={control}
        name="landCategory"
        render={({ field: { onChange, value } }) => {
          const { showActionSheetWithOptions } = useActionSheet();
          const options = [t('addProperty.placeholders.selectCategory'), ...landCategories.map(c => t(`property_category.sub.${c}`)), t('addProperty.actions.cancelTitle')];
          return (
            <CustomSelect
              label={t('addProperty.labels.landCategory')}
              value={value ? `property_category.sub.${value}` : ''}
              placeholder={t('addProperty.placeholders.selectCategory')}
              error={errors.landCategory}
              onPress={() => showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, (i) => {
                if (i !== undefined && i > 0 && i < options.length - 1) {
                  onChange(landCategories[i-1]);
                }
              })}
            />
          );
        }}
      />

      <SectionHeader title={t('addProperty.headers.accessibility')} icon="material-symbols:add-road-rounded" />
      <View className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
        <Controller control={control} name="hasRoadAccess" render={({ field: { onChange, value } }) => (
          <CustomSwitch label={t('addProperty.labels.roadAccess')} value={value} onChange={onChange} />
        )} />
      </View>
    </>
  );

  const renderContent = () => {
    switch (propertyType) {
      case 'RESIDENTIAL':
        return renderResidentialFields();
      case 'COMMERCIAL':
        return renderCommercialFields();
      case 'GARAGE':
        return renderGarageFields();
      case 'LAND':
        return renderLandFields();
      default:
        return <ThemedText>{t('validationError')}</ThemedText>;
    }
  };

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <ThemedView className="p-4 gap-4">
        {/* Header Section */}
        <View className="flex-row items-center gap-3 mb-2">
          <View className="p-2.5 rounded-full shadow-sm" style={{ backgroundColor: backgroundColor, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <ThemedIcon icon="material-symbols:assignment-turned-in" size={26} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.details')} />
          </View>
          <View>
            <ThemedText type="subtitle" className="text-xl font-bold">{t('addProperty.headers.propertyDetails')}</ThemedText>
            <ThemedText className="text-sm opacity-60">{t('addProperty.stepCounter', { current: 4, total: 5 })}</ThemedText>
          </View>
        </View>

        <View
          className="p-5 rounded-3xl border"
          style={{
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          {renderContent()}
        </View>
      </ThemedView>
    </Animated.View>
  );
}

// Rimosso StyleSheet.create
