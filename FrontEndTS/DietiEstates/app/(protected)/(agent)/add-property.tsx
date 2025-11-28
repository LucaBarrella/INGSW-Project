import React from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native'; // Aggiunto ActivityIndicator
import { useForm, SubmitHandler, FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Importa il resolver
import { ThemedView } from '@/components/ThemedView';

import ListingTypeSelector from '@/components/Agent/AddPropertySteps/ListingTypeSelector';
import Step1_PropertyType from '@/components/Agent/AddPropertySteps/Step1_PropertyType';
import Step2_BasicDetails from '@/components/Agent/AddPropertySteps/Step2_BasicDetails';
import Step3_LocationStatus from '@/components/Agent/AddPropertySteps/Step3_LocationStatus';
import Step4_PropertyDetails from '@/components/Agent/AddPropertySteps/Step4_PropertyDetails';
import Step5_Photos from '@/components/Agent/AddPropertySteps/Step5_Photos';
import PropertyTypeDescription from '@/components/Agent/AddPropertySteps/PropertyTypeDescription';
import ThemedButton from '@/components/ThemedButton';
import StepIndicator from '@/components/StepIndicator';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { propertySchema, PropertyFormData } from './schemas/propertySchema'; // Importa lo schema e il tipo
import httpClient from '@/src/core/httpClient';
// import { usePropertiesViewModel } from '@/src/hooks/usePropertiesViewModel';

// Define the complete form data structure
// interface PropertyFormData { // Rimosso, ora importato dallo schema
//   // Step 1
  // listingType: ListingType | null;
  // propertyType: PropertyType | null;
  // // Step 2
  // title: string;
  // description: string;
  // price: string;
  // size: string;
  // // Step 3
  // address: string;
  // city: string;
  // energyClass: string;
  // availability: boolean;
  // // Step 4
  // residentialCategory?: string;
  // rooms?: string;
  // bathrooms?: string;
  // floor?: string;
  // elevator?: boolean;
  // pool?: boolean;
  // commercialCategory?: string;
  // commercialBathrooms?: string;
  // emergencyExit?: boolean;
  // constructionDate?: string;
  // industrialCategory?: string;
  // ceilingHeight?: string;
  // fireSystem?: boolean;
  // floorLoad?: string;
  // offices?: string;
  // structure?: string;
  // landCategory?: string;
  // soilType?: string;
  // slope?: string;i
//   // Step 5 - Images handled separately
// }

// Mapping dei campi per step per la validazione
const fieldsByStep: Record<number, FieldName<PropertyFormData>[]> = {
  1: ['listingType', 'propertyType'],
  2: ['description', 'price', 'area'],
  3: ['addressRequest', 'energyClass', 'condition'],
  4: [
      'residentialCategory', 'rooms', 'bathrooms', 'floor', 'elevator', 'pool',
      'commercialCategory', 'commercialBathrooms', 'emergencyExit', 'constructionDate',
      'garageCategory', 'numberOfFloors',
      'landCategory', 'soilType', 'slope'
     ] as any[],
  5: [],
};

export default function AddPropertyScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint'); // Per ActivityIndicator
  const buttonTextColor = useThemeColor({}, 'buttonTextColor'); // Ottieni il colore qui
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const loading = false;
  const viewModelError = null;
  const createProperty = async (data: any, images: string[]) => {
  const formData = new FormData();
  
  // Add the property data as a JSON string directly
  // Spring Boot's @RequestPart will parse this automatically
  formData.append('property', {
    string: JSON.stringify(data),
    type: 'application/json'
  } as any);
  
  // Add each image file
  for (let i = 0; i < images.length; i++) {
    const uri = images[i];
    const filename = uri.split('/').pop() || `image_${i}.webp`;
    
    formData.append('images', {
      uri: uri,
      type: 'image/webp',
      name: filename,
    } as any);
  }
  
  const response = await httpClient.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });
  
  return response.data;
};

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema), // Applica il resolver
    defaultValues: {
      contractType: undefined,
      propertyType: undefined,
      description: '',
      price: '',
      area: '',
      addressRequest: {
        country: '',
        province: '',
        city: '',
        street: '',
        streetNumber: '',
        building: '',
        latitude: undefined,
        longitude: undefined,
      },
      condition: undefined,
      energyClass: 'NOT_APPLIABLE', // Potrebbe richiedere un valore di default valido per l'enum/picker
      elevator: false,
      pool: false,
      emergencyExit: false,
      hasSurveillance: false,
    },
    mode: 'onBlur', // Valida quando l'utente lascia il campo per un feedback migliore
  });

  const watchedPropertyType = watch('propertyType');

  const handleImagesChange = (uris: string[]) => {
    setSelectedImages(uris);
  };

  const renderStepContent = () => {
    const commonProps = { control, errors };
    switch (currentStep) {
      case 1:
        return (
          <>
            <ListingTypeSelector control={control} name="contractType" rules={{ required: 'Seleziona un tipo di annuncio' }} errors={errors} />
            <Step1_PropertyType control={control} name="propertyType" rules={{ required: 'Seleziona un tipo di proprietà' }} errors={errors} />
            <PropertyTypeDescription selectedType={watchedPropertyType} />
          </>
        );
      case 2: return <Step2_BasicDetails {...commonProps} />;
      case 3: return <Step3_LocationStatus {...commonProps} setValue={setValue} />;
      case 4: return <Step4_PropertyDetails {...commonProps} propertyType={watchedPropertyType} />;
      case 5: return <Step5_Photos selectedImages={selectedImages} onImagesChange={handleImagesChange} />;
      default: return null;
    }
  };

  // Funzione per validare e passare allo step successivo
  const nextStep = async () => {
    // Valida solo i campi dello step corrente
    const fieldsToValidate = fieldsByStep[currentStep];
    if (!fieldsToValidate || fieldsToValidate.length === 0) {
      // Se non ci sono campi specifici per questo step (es. step 5), vai avanti
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      return;
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      console.log("Validation Errors for Step", currentStep, ":", errors); // Log per debug specifico dello step
      if (errors.addressRequest?.latitude || errors.addressRequest?.longitude) {
        Alert.alert(
          "Errore di Validazione",
          "Per favore, assicurati di aver selezionato un indirizzo valido dai suggerimenti in alto per permetterci di geolocalizzare la tua proprietà.",
          [{ text: "OK" }]
        );
      }
      // Gli errori verranno mostrati automaticamente dai componenti grazie a RHF e alla modalità onBlur/onChange
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Funzione di submit finale
  const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    console.log("isSubmitting:", isSubmitting);
    if (isSubmitting) return; // Previene submit multipli
    setIsSubmitting(true);

    console.log('Submitting Data:', data);

    try {
      // 1. Preparazione Dati
      const propertyData: any = {
        propertyCategory: {propertyType: data.propertyType, name: data.residentialCategory || data.commercialCategory || data.garageCategory || data.landCategory},
        contractType: data.contractType,
        propertyType: data.propertyType,
        description: data.description,
        price: parseFloat(data.price), // Zod assicura che sia un numero stringa valido
        area: parseInt(data.area), // Zod assicura che sia un numero stringa valido
        addressRequest: data.addressRequest,
        energyRating: data.energyClass, // Zod assicura che sia un valore valido
        condition: data.condition,
      };

      // Aggiungi campi specifici in base al tipo
      switch (data.propertyType) {
        case 'RESIDENTIAL':
          propertyData.propertyCategoryName = data.residentialCategory;
          propertyData.rooms = data.rooms;
          propertyData.bathrooms = data.bathrooms;
          propertyData.floor = data.floor;
          propertyData.elevator = data.elevator;
          propertyData.pool = data.pool;
          break;
        case 'COMMERCIAL':
          propertyData.propertyCategoryName = data.commercialCategory;
          propertyData.bathrooms = parseInt(data.commercialBathrooms, 10);
          propertyData.emergencyExit = data.emergencyExit;
          propertyData.constructionDate = parseInt(data.constructionDate, 10); // Zod assicura che sia un anno valido
          break;
        case 'GARAGE':
          propertyData.propertyCategoryName = data.garageCategory;
          propertyData.hasSurveillance = data.hasSurveillance;
          propertyData.numberOfFloors = data.numberOfFloors;
          propertyData.floor = data.floor;
          break;
        case 'LAND':
          propertyData.propertyCategoryName = data.landCategory;
          propertyData.soilType = data.soilType;
          propertyData.slope = parseFloat(data.slope);
          break;
      }

      console.log('Property Data Prepared:', propertyData);
      console.log('Selected Images:', selectedImages);

      // Chiamata al ViewModel
      const response = await createProperty(propertyData, selectedImages);
      console.log("ViewModel Response:", response); // Log della risposta (utile per debug)

      // 4. Gestione Risposta - Naviga alla schermata di feedback
      if (response) {
        router.replace({
          pathname: '/feedback',
          params: {
            status: 'success',
            title: 'Successo!',
            message: 'Il tuo immobile è stato aggiunto correttamente.',
            buttonLabel: 'Torna alla Home',
            buttonAction: '/(protected)/(agent)/(tabs)/home', // Reindirizza alla home dell'agente
          },
        });
      } else {
        // Gestione del caso di fallimento
        throw new Error('Errore durante la creazione dell\'immobile.');
      }

    } catch (error: any) {
      console.error('Errore durante il salvataggio:', error);
      // Naviga alla schermata di feedback in caso di errore
      router.push({ // Usiamo push per permettere all'utente di tornare indietro al form
        pathname: '/feedback',
        params: {
          status: 'error',
          title: 'Errore Salvataggio',
          message: error.message || 'Si è verificato un errore imprevisto durante il salvataggio. Riprova.',
          buttonLabel: 'Torna al Form',
          buttonAction: 'back', // Permette di tornare indietro
        },
      });
    } finally {
      setIsSubmitting(false); // Riabilita il pulsante
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: backgroundColor }} contentContainerStyle={{ paddingBottom: 50 }}>
      <ThemedView className="p-4 gap-4">
        <View className="h-16 items-center justify-center">
          <StepIndicator currentStep={currentStep} totalSteps={5} />
        </View>
        {renderStepContent()}

        <ThemedView className="flex-row justify-between items-center mt-5 gap-x-6">
          {currentStep > 1 && (
            <ThemedButton
              title="Indietro"
              onPress={prevStep}
              disabled={isSubmitting}
              className="py-3 px-4" // Padding e nessuna flessibilità specifica qui
            />
          )}

          {currentStep < 5 && (
            <ThemedButton
              title="Avanti"
              onPress={nextStep}
              disabled={isSubmitting}
              className={`py-3 px-4 flex-grow ${currentStep === 1 ? 'ml-auto' : ''}`} // flex-grow sempre, ml-auto per step 1
            />
          )}
          {currentStep === 5 && (
            <ThemedButton
              title={isSubmitting || loading ? "Salvataggio..." : "Salva Immobile"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || loading}
              className="py-3 px-4 flex-grow"
            >
              {(isSubmitting || loading) && <ActivityIndicator color={buttonTextColor} style={{ marginLeft: 8 }} />}
            </ThemedButton>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
