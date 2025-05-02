import React from 'react';
import { View, Switch } from 'react-native'; // Rimosso StyleSheet
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { Picker } from '@react-native-picker/picker';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define props for react-hook-form integration
interface Step3LocationStatusProps {
  control: Control<any>; // Control object from useForm
  errors: FieldErrors; // Errors object from useForm
}

// Define available energy classes based on current file
const energyClasses = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];

export default function Step3_LocationStatus({ control, errors }: Step3LocationStatusProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const themeErrorColor = useThemeColor({}, 'error'); // Usa colore errore dal tema

  // Le regole di validazione sono ora gestite dallo schema Zod
  // const requiredRule = { required: 'Questo campo è obbligatorio' };

  return (
    // Applicato NativeWind: p-2.5 (padding: 10), gap-1.5 (gap: 5)
    <ThemedView className="p-2.5 gap-1.5">
      {/* Applicato NativeWind: mb-4 (marginBottom: 15), text-center */}
      <ThemedText type="subtitle" className="mb-4 text-center">Località e Stato</ThemedText>

      <Controller
        control={control}
        name="address"
        // rules={requiredRule} // Rimosso
        render={({ field: { onChange, onBlur, value } }) => (
          // Rimosso Fragment
            <LabelInput
              label="Indirizzo Completo"
              placeholder="Es. Via Roma, 10"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.address}
              errorMessage={errors.address?.message as string} // Passa messaggio errore
            />
            // Rimosso ThemedText errore
        )}
      />

      <Controller
        control={control}
        name="city"
        // rules={requiredRule} // Rimosso
        render={({ field: { onChange, onBlur, value } }) => (
          // Rimosso Fragment
            <LabelInput
              label="Città / Comune"
              placeholder="Es. Napoli"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.city}
              errorMessage={errors.city?.message as string} // Passa messaggio errore
            />
            // Rimosso ThemedText errore
        )}
      />

      {/* Energy Class Picker */}
      <Controller
        control={control}
        name="energyClass"
        // rules={requiredRule} // Rimosso
        render={({ field: { onChange, value } }) => (
          // Applicato NativeWind: mb-1.5 (marginBottom: 5)
          <View className="mb-1.5">
            {/* Applicato NativeWind: mb-2 (marginBottom: 8), text-base (fontSize: 16) */}
            <ThemedText className="mb-2 text-base">Classe Energetica</ThemedText>
            {/* Applicato NativeWind: border rounded min-h-[40px] justify-center */}
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.energyClass ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker
                selectedValue={value || ''} // Default a stringa vuota se undefined
                onValueChange={onChange} // Use RHF's onChange
                // Applicato NativeWind: w-full h-[50px]
                style={{ color: textColor, width: '100%', height: 50 }} // Mantenuto stile per colore e dimensioni Picker
                dropdownIconColor={textColor}
              >
                <Picker.Item label="Seleziona classe..." value="" enabled={false} />
                {energyClasses.map((ec) => (
                  <Picker.Item key={ec} label={ec} value={ec} />
                ))}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.energyClass && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.energyClass.message as string}</ThemedText>}
          </View>
        )}
      />


      {/* Availability Switch */}
      <Controller
        control={control}
        name="availability"
        // No rules needed for switch usually, default value is handled in useForm
        render={({ field: { onChange, value } }) => (
          // Applicato NativeWind: mb-1.5 flex-row justify-between items-center py-2 mt-2.5 (marginTop: 10)
          <View className="mb-1.5 flex-row justify-between items-center py-2 mt-2.5">
            {/* Applicato NativeWind: text-base */}
            <ThemedText className="text-base">Disponibilità Immediata</ThemedText>
            <Switch
              trackColor={{ false: "#767577", true: tint + '80' }} // Mantenuto stile per colori dinamici track
              thumbColor={value ? tint : "#f4f3f4"} // Mantenuto stile per colore dinamico thumb
              ios_backgroundColor="#3e3e3e"
              onValueChange={onChange} // Use RHF's onChange
              value={!!value} // Ensure value is boolean
            />
            {/* Errors for switches are less common */}
          </View>
        )}
      />
    </ThemedView>
  );
}

// Rimosso StyleSheet.create