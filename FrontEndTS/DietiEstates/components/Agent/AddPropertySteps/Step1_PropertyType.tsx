import React from 'react';
import { View } from 'react-native'; // Rimosso Pressable
import { Controller, Control, FieldErrors, RegisterOptions } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CategoryButton } from '@/components/Buyer/CategoryButton'; // Importato CategoryButton

// Define PropertyType based on current file
export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND';

// Define props for react-hook-form integration
interface Step1PropertyTypeProps {
  control: Control<any>; // Control object from useForm
  name: string; // Name of the field in the form
  rules?: RegisterOptions; // Validation rules
  errors: FieldErrors; // Errors object from useForm
}

// Define property types based on current file
const propertyTypes: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'RESIDENTIAL', label: 'Residenziale', icon: 'material-symbols:home-outline' },
  { type: 'COMMERCIAL', label: 'Commerciale', icon: 'material-symbols:business-center-outline' },
  { type: 'INDUSTRIAL', label: 'Industriale', icon: 'material-symbols:factory-outline' },
  { type: 'LAND', label: 'Terreno', icon: 'material-symbols:landscape-outline' },
];

export default function Step1_PropertyType({ control, name, rules, errors }: Step1PropertyTypeProps) {
  // Colore per il messaggio di errore
  const errorColor = useThemeColor({ light: '#FF0000', dark: '#FF6B6B' }, 'error');

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => ( // Get onChange and value from field
        <ThemedView className="p-6">
          <ThemedText type="defaultSemiBold" className="mb-3 text-base">
            Tipo di Proprietà
          </ThemedText>
          {/* Manteniamo la View per il layout flex */}
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {propertyTypes.map(({ type, label, icon }) => {
              const isSelected = value === type; // Use value from RHF
              return (
                // Aggiungiamo una View wrapper per controllare la larghezza
                <View key={type} className="w-[48%]">
                  <CategoryButton
                    icon={icon}
                    label={label}
                    onPress={() => onChange(type)}
                    isSelected={isSelected}

                    // Nota: CategoryButton usa p-4, non aspect-square.
                    // L'aspetto potrebbe variare leggermente.
                  />
                </View>
              );
            })}
          </View>
          {/* Visualizzazione errore rimane invariata */}
          {errors[name] && (
            <ThemedText className="mt-2 text-sm" style={{ color: errorColor }}>
              {errors[name]?.message as string}
            </ThemedText>
          )}
        </ThemedView>
      )}
    />
  );
}