import React from 'react';
import { View, Switch } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LabelInput } from '@/components/LabelInput';
import { Picker } from '@react-native-picker/picker';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyType } from './Step1_PropertyType';

// Define props for react-hook-form integration
interface Step4PropertyDetailsProps {
  control: Control<any>; // Control object from useForm
  errors: FieldErrors; // Errors object from useForm
  propertyType: PropertyType | null; // Type selected in Step 1
}

// Define options for pickers (example values)
const residentialCategories = ['Appartamento', 'Villa', 'Attico', 'Monolocale', 'Bilocale'];
const commercialCategories = ['Negozio', 'Ufficio', 'Magazzino', 'Ristorante'];
const industrialCategories = ['Capannone', 'Laboratorio', 'Area Produttiva'];
const landCategories = ['Agricolo', 'Edificabile', 'Boschivo'];
const structureTypes = ['Cemento Armato', 'Acciaio', 'Muratura Portante', 'Legno'];
const soilTypes = ['Argilloso', 'Sabbioso', 'Limoso', 'Ghiaioso'];

export default function Step4_PropertyDetails({ control, errors, propertyType }: Step4PropertyDetailsProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const themeErrorColor = useThemeColor({}, 'error'); // Usa colore errore dal tema

  // Rimosse regole locali, ora gestite da Zod

  const renderResidentialFields = () => (
    <>
      <Controller
        control={control}
        name="residentialCategory"
        // rules rimosse
        render={({ field: { onChange, value } }) => (
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Categoria Residenziale</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.residentialCategory ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona categoria..." value="" enabled={false} />
                {residentialCategories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.residentialCategory && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.residentialCategory.message as string}</ThemedText>}
          </View>
        )}
      />
      <Controller control={control} name="rooms" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => (
        <LabelInput
          label="Numero Locali"
          placeholder="Es. 3"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          keyboardType="numeric"
          error={!!errors.rooms}
          errorMessage={errors.rooms?.message as string}
        />
      )} />
      <Controller control={control} name="bathrooms" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => (
         <LabelInput
           label="Numero Bagni"
           placeholder="Es. 2"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric"
           error={!!errors.bathrooms}
           errorMessage={errors.bathrooms?.message as string}
         />
      )} />
      <Controller control={control} name="floor" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Floor might not be required
         <LabelInput
           label="Piano"
           placeholder="Es. 2 (0 per piano terra)"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric" // Zod gestisce la validazione numerica
           error={!!errors.floor}
           errorMessage={errors.floor?.message as string}
         />
      )} />
      <Controller control={control} name="elevator" render={({ field: { onChange, value } }) => (
        <View className="mb-1.5 flex-row justify-between items-center py-2 mt-2.5"><ThemedText className="text-base">Ascensore</ThemedText><Switch trackColor={{ false: "#767577", true: tint + '80' }} thumbColor={value ? tint : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={onChange} value={!!value} /></View>
      )} />
      <Controller control={control} name="pool" render={({ field: { onChange, value } }) => (
        <View className="mb-1.5 flex-row justify-between items-center py-2 mt-2.5"><ThemedText className="text-base">Piscina</ThemedText><Switch trackColor={{ false: "#767577", true: tint + '80' }} thumbColor={value ? tint : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={onChange} value={!!value} /></View>
      )} />
    </>
  );

  const renderCommercialFields = () => (
    <>
      <Controller
        control={control}
        name="commercialCategory"
        // rules rimosse
        render={({ field: { onChange, value } }) => (
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Categoria Commerciale</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.commercialCategory ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona categoria..." value="" enabled={false} />
                {commercialCategories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.commercialCategory && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.commercialCategory.message as string}</ThemedText>}
          </View>
        )}
      />
       <Controller control={control} name="commercialBathrooms" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Optional?
         <LabelInput
           label="Numero Bagni (Servizi)"
           placeholder="Es. 1"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric"
           error={!!errors.commercialBathrooms}
           errorMessage={errors.commercialBathrooms?.message as string}
         />
      )} />
       <Controller control={control} name="emergencyExit" render={({ field: { onChange, value } }) => (
        <View className="mb-1.5 flex-row justify-between items-center py-2 mt-2.5"><ThemedText className="text-base">Uscita di Sicurezza</ThemedText><Switch trackColor={{ false: "#767577", true: tint + '80' }} thumbColor={value ? tint : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={onChange} value={!!value} /></View>
      )} />
       <Controller control={control} name="constructionDate" render={({ field: { onChange, onBlur, value } }) => ( // Optional? Zod gestisce la validazione dell'anno
         <LabelInput
           label="Anno di Costruzione"
           placeholder="Es. 1995"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric"
           error={!!errors.constructionDate}
           errorMessage={errors.constructionDate?.message as string}
         />
      )} />
    </>
  );

  const renderIndustrialFields = () => (
    <>
      <Controller
        control={control}
        name="industrialCategory"
        // rules rimosse
        render={({ field: { onChange, value } }) => (
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Categoria Industriale</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.industrialCategory ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona categoria..." value="" enabled={false} />
                {industrialCategories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.industrialCategory && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.industrialCategory.message as string}</ThemedText>}
          </View>
        )}
      />
      <Controller control={control} name="ceilingHeight" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Optional?
        <LabelInput
          label="Altezza Soffitto (m)"
          placeholder="Es. 4.5"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          keyboardType="numeric"
          error={!!errors.ceilingHeight}
          errorMessage={errors.ceilingHeight?.message as string}
        />
      )} />
       <Controller control={control} name="floorLoad" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Optional?
         <LabelInput
           label="Carico Pavimento (kg/mq)"
           placeholder="Es. 1500"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric"
           error={!!errors.floorLoad}
           errorMessage={errors.floorLoad?.message as string}
         />
      )} />
       <Controller control={control} name="offices" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Optional?
         <LabelInput
           label="Numero Uffici Interni"
           placeholder="Es. 3"
           onBlur={onBlur}
           onChangeText={onChange}
           value={value}
           keyboardType="numeric"
           error={!!errors.offices}
           errorMessage={errors.offices?.message as string}
         />
      )} />
      <Controller control={control} name="fireSystem" render={({ field: { onChange, value } }) => (
         <View className="mb-1.5 flex-row justify-between items-center py-2 mt-2.5"><ThemedText className="text-base">Impianto Antincendio</ThemedText><Switch trackColor={{ false: "#767577", true: tint + '80' }} thumbColor={value ? tint : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={onChange} value={!!value} /></View>
      )} />
       <Controller
        control={control}
        name="structure"
        render={({ field: { onChange, value } }) => ( // Optional?
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Tipo Struttura</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.structure ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona struttura..." value="" enabled={false} />
                {structureTypes.map((type) => <Picker.Item key={type} label={type} value={type} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.structure && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.structure.message as string}</ThemedText>}
          </View>
        )}
      />
    </>
  );

  const renderLandFields = () => (
    <>
      <Controller
        control={control}
        name="landCategory"
        // rules rimosse
        render={({ field: { onChange, value } }) => (
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Categoria Terreno</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.landCategory ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona categoria..." value="" enabled={false} />
                {landCategories.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.landCategory && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.landCategory.message as string}</ThemedText>}
          </View>
        )}
      />
      <Controller
        control={control}
        name="soilType"
        render={({ field: { onChange, value } }) => ( // Optional?
          <View className="mb-1.5">
            <ThemedText className="mb-2 text-base">Tipo di Suolo</ThemedText>
            <View
              className="border rounded min-h-[40px] justify-center"
              style={{ borderColor: errors.soilType ? themeErrorColor : borderColor, backgroundColor: backgroundColor }} // Usa themeErrorColor
            >
              <Picker selectedValue={value || ''} onValueChange={onChange} style={{ color: textColor, width: '100%', height: 50 }} dropdownIconColor={textColor}>
                <Picker.Item label="Seleziona tipo..." value="" enabled={false} />
                {soilTypes.map((type) => <Picker.Item key={type} label={type} value={type} />)}
              </Picker>
            </View>
            {/* Visualizza errore sotto il Picker */}
            {errors.soilType && <ThemedText className="mt-1 mb-2.5 text-xs" style={{ color: themeErrorColor }}>{errors.soilType.message as string}</ThemedText>}
          </View>
        )}
      />
      <Controller control={control} name="slope" /* rules rimosse */ render={({ field: { onChange, onBlur, value } }) => ( // Optional?
        <LabelInput
          label="Pendenza (%)"
          placeholder="Es. 5"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          keyboardType="numeric"
          error={!!errors.slope}
          errorMessage={errors.slope?.message as string}
        />
      )} />
    </>
  );

  const renderContent = () => {
    switch (propertyType) {
      case 'RESIDENTIAL':
        return renderResidentialFields();
      case 'COMMERCIAL':
        return renderCommercialFields();
      case 'INDUSTRIAL':
        return renderIndustrialFields();
      case 'LAND':
        return renderLandFields();
      default:
        return <ThemedText>Seleziona un tipo di proprietà nello Step 1.</ThemedText>;
    }
  };

  return (
    <ThemedView className="p-2.5 gap-1.5">
      <ThemedText type="subtitle" className="mb-4 text-center">Dettagli Specifici</ThemedText>
      {renderContent()}
    </ThemedView>
  );
}

// Rimosso StyleSheet.create
