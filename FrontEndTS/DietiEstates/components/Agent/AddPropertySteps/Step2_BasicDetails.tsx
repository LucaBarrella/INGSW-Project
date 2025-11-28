import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';

// Define props for react-hook-form integration
interface Step2BasicDetailsProps {
  control: Control<any>; // Control object from useForm
  errors: FieldErrors; // Errors object from useForm
}

export default function Step2_BasicDetails({ control, errors }: Step2BasicDetailsProps) {
  // Ottieni il colore di errore dal tema, fallback a rosso se non definito
  // const errorColor = useThemeColor({}, 'error'); // Non più necessario qui

  // Le regole di validazione sono ora gestite dallo schema Zod
  // const requiredRule = { required: 'Questo campo è obbligatorio' };
  // const numericRule = { ... };

  return (
    // Applicato NativeWind: p-2.5 (padding: 10), gap-1.5 (gap: 5)
    <ThemedView className="p-2.5 gap-1.5">
      {/* Applicato NativeWind: mb-4 (marginBottom: 15), text-center */}
      <ThemedText type="subtitle" className="mb-4 text-center">Dettagli Base</ThemedText>

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
            <LabelInput
              label="Descrizione"
              placeholder="Descrivi l'immobile..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              error={!!errors.description}
              errorMessage={errors.description?.message as string} // Passa il messaggio di errore
            />
        )}
      />

      <Controller
        control={control}
        name="price"
        // rules={{ ...requiredRule, ...numericRule }} // Rimosso
        render={({ field: { onChange, onBlur, value } }) => (
          // Rimosso Fragment non necessario
            <LabelInput
              label="Prezzo (€)"
              placeholder="Es. 300000"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              error={!!errors.price}
              errorMessage={errors.price?.message as string} // Passa il messaggio di errore
            />
            // Rimosso ThemedText per errore
        )}
      />

      <Controller
        control={control}
        name="area"
        // rules={{ ...requiredRule, ...numericRule }} // Rimosso
        render={({ field: { onChange, onBlur, value } }) => (
          // Rimosso Fragment non necessario
            <LabelInput
              label="Dimensione (mq)"
              placeholder="Es. 120"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              error={!!errors.area}
              errorMessage={errors.area?.message as string} // Passa il messaggio di errore
            />
            // Rimosso ThemedText per errore
        )}
      />
    </ThemedView>
  );
}