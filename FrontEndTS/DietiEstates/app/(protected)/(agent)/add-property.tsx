import React from 'react';
import { Alert, ScrollView, View, ActivityIndicator } from 'react-native'; // Aggiunto ActivityIndicator
import { useForm, Controller, SubmitHandler, FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Importa il resolver
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

import ListingTypeSelector, { ListingType } from '@/components/Agent/AddPropertySteps/ListingTypeSelector';
import Step1_PropertyType, { PropertyType } from '@/components/Agent/AddPropertySteps/Step1_PropertyType';
import Step2_BasicDetails from '@/components/Agent/AddPropertySteps/Step2_BasicDetails';
import Step3_LocationStatus from '@/components/Agent/AddPropertySteps/Step3_LocationStatus';
import Step4_PropertyDetails from '@/components/Agent/AddPropertySteps/Step4_PropertyDetails';
import Step5_Photos from '@/components/Agent/AddPropertySteps/Step5_Photos';
import PropertyTypeDescription from '@/components/Agent/AddPropertySteps/PropertyTypeDescription';
import ThemedButton from '@/components/ThemedButton';
import StepIndicator from '@/components/StepIndicator';
import { useThemeColor } from '@/hooks/useThemeColor';
import ApiService from '@/app/_services/api.service';
import { router } from 'expo-router';
import { propertySchema, PropertyFormData } from './schemas/propertySchema'; // Importa lo schema e il tipo

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
  2: ['title', 'description', 'price', 'size'],
  3: ['address', 'city', 'energyClass', 'availability'],
  4: [ // Cast a 'any' per bypassare l'inferenza TS restrittiva sui campi specifici
       // La validazione Zod gestirà comunque la logica corretta al runtime.
      'residentialCategory', 'rooms', 'bathrooms', 'floor', 'elevator', 'pool',
      'commercialCategory', 'commercialBathrooms', 'emergencyExit', 'constructionDate',
      'industrialCategory', 'ceilingHeight', 'fireSystem', 'floorLoad', 'offices', 'structure',
      'landCategory', 'soilType', 'slope'
     ] as any[], // Cast dell'intero array a any[]
  5: [], // Nessun campo RHF per le foto per ora
};

export default function AddPropertyScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint'); // Per ActivityIndicator
  const buttonTextColor = useThemeColor({}, 'buttonTextColor'); // Ottieni il colore qui
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema), // Applica il resolver
    defaultValues: {
      listingType: undefined, // Usa undefined per i tipi enum/literal opzionali con Zod
      propertyType: undefined,
      title: '',
      description: '',
      price: '',
      size: '',
      address: '',
      city: '',
      energyClass: '', // Potrebbe richiedere un valore di default valido per l'enum/picker
      availability: true,
      elevator: false,
      pool: false,
      emergencyExit: false,
      fireSystem: false,
      // Aggiungere altri default se necessario per Zod
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
            <ListingTypeSelector control={control} name="listingType" rules={{ required: 'Seleziona un tipo di annuncio' }} errors={errors} />
            <Step1_PropertyType control={control} name="propertyType" rules={{ required: 'Seleziona un tipo di proprietà' }} errors={errors} />
            <PropertyTypeDescription selectedType={watchedPropertyType} />
          </>
        );
      case 2: return <Step2_BasicDetails {...commonProps} />;
      case 3: return <Step3_LocationStatus {...commonProps} />;
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
      // Gli errori verranno mostrati automaticamente dai componenti grazie a RHF e alla modalità onBlur/onChange
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Funzione di submit finale
  const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    if (isSubmitting) return; // Previene submit multipli
    setIsSubmitting(true);

    // 1. Preparazione Dati
    const apiData: any = {
      listingType: data.listingType,
      propertyType: data.propertyType,
      title: data.title,
      description: data.description,
      price: parseFloat(data.price), // Zod assicura che sia un numero stringa valido
      size: parseInt(data.size, 10), // Zod assicura che sia un numero stringa valido
      address: data.address,
      city: data.city,
      energyClass: data.energyClass, // Zod assicura che sia un valore valido
      availability: data.availability,
      // Aggiungi campi specifici basati su propertyType
    };

    // Aggiungi campi specifici in base al tipo
    switch (data.propertyType) {
      case 'RESIDENTIAL':
        // Con Zod, i tipi dovrebbero essere già corretti se la validazione passa
        apiData.category = data.residentialCategory;
        apiData.rooms = parseInt(data.rooms, 10);
        apiData.bathrooms = parseInt(data.bathrooms, 10);
        apiData.floor = parseInt(data.floor, 10); // Zod assicura che sia un numero stringa valido
        apiData.elevator = data.elevator;
        apiData.pool = data.pool;
        break;
      case 'COMMERCIAL':
        apiData.category = data.commercialCategory;
        apiData.bathrooms = parseInt(data.commercialBathrooms, 10);
        apiData.emergencyExit = data.emergencyExit;
        apiData.constructionDate = parseInt(data.constructionDate, 10); // Zod assicura che sia un anno valido
        break;
      case 'INDUSTRIAL':
        apiData.category = data.industrialCategory;
        apiData.ceilingHeight = parseFloat(data.ceilingHeight);
        apiData.fireSystem = data.fireSystem;
        apiData.floorLoad = parseInt(data.floorLoad, 10);
        apiData.offices = parseInt(data.offices, 10);
        apiData.structure = data.structure;
        break;
      case 'LAND':
        apiData.category = data.landCategory;
        apiData.soilType = data.soilType;
        apiData.slope = parseFloat(data.slope);
        break;
    }

    console.log('API Data Prepared:', apiData);
    console.log('Selected Images:', selectedImages);

    // 2. Upload Immagini (Simulato)
    // TODO: Sostituire con logica di upload reale (es. FormData o SDK Cloudinary/S3)
    console.log("Simulating image uploads...");
    const uploadedImageUrls: string[] = [];
    for (const uri of selectedImages) {
      try {
        // Simula il tempo di upload per ogni immagine
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockUrl = `https://cdn.example.com/images/${uri.split('/').pop()?.split('.')[0]}-${Date.now()}.jpg`;
        uploadedImageUrls.push(mockUrl);
        console.log(`Simulated upload success for ${uri} -> ${mockUrl}`);
      } catch (uploadError) {
        console.error(`Simulated upload failed for ${uri}:`, uploadError);
        // Decidere come gestire errori di upload parziali (es. interrompere o continuare?)
        // Per ora, continuiamo ma logghiamo l'errore.
      }
    }
    console.log("Simulated image uploads complete:", uploadedImageUrls);


    // 3. Chiamata API
    try {
      // Aggiungi gli URL delle immagini ai dati API (il nome del campo dipende dal backend)
      apiData.imageUrls = uploadedImageUrls;

      // Chiamata API reale (usando la versione mock per ora)
      const response = await ApiService.createProperty(apiData);
      console.log("API Response:", response); // Log della risposta (utile per debug)

      // 4. Gestione Risposta - Naviga alla schermata di feedback
      if (response.success) {
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
        // Anche se l'API mock restituisce sempre successo, gestiamo il caso teorico di fallimento
        throw new Error(response.message || 'Errore durante la creazione dell\'immobile.');
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

        <ThemedView className="flex-row justify-between mt-5">
          {currentStep > 1 && (
            <ThemedButton title="Indietro" onPress={prevStep} disabled={isSubmitting} /> // Rimosso type="secondary"
          )}
          {/* Assicurati che ci sia spazio per il pulsante Indietro */}
          <View style={{ flex: currentStep === 1 ? 1 : 0 }} />

          {currentStep < 5 && (
            <ThemedButton title="Avanti" onPress={nextStep} disabled={isSubmitting} />
          )}
          {currentStep === 5 && (
            <ThemedButton
              title={isSubmitting ? "Salvataggio..." : "Salva Immobile"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {/* Usa la variabile definita sopra */}
              {isSubmitting && <ActivityIndicator color={buttonTextColor} style={{ marginLeft: 8 }} />}
            </ThemedButton>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
