import React from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native'; // Aggiunto ActivityIndicator
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Importa il resolver
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import * as ImageManipulator from 'expo-image-manipulator';
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
import { propertySchema, PropertyFormData, customErrorMap } from './schemas/propertySchema'; // Importa lo schema e il tipo
import httpClient from '@/src/core/httpClient';
import { t } from 'i18next';

// Mapping dei campi per step per la validazione
const fieldsByStep: Record<number, any[]> = {
  1: ['contractType', 'propertyType'],
  2: ['description', 'price', 'area'],
  3: ['addressRequest', 'energyRating', 'condition'],
  4: [
      'residentialCategory', 'numberOfRooms', 'numberOfBathrooms', 'floor', 'hasElevator',
      'commercialCategory', 'hasDisabledAccess', 'yearBuilt',
      'garageCategory', 'hasSurveillance', 'numberOfFloors', 'parkingSpaces',
      'landCategory', 'garden', 'isFurnished', 'heatingType', 'hasRoadAccess'
     ],
  5: [],
};

export default function AddPropertyScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const loading = false;
  const createProperty = async (data: any, images: string[]) => {
    const formData = new FormData();

    const jsonString = JSON.stringify(data);

    formData.append('property', {
      uri: 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(jsonString))),
      name: 'property.json',
      type: 'application/json',
    } as any);

    for (let i = 0; i < images.length; i++) {
      const uri = images[i];
      
      try {
        // @ts-ignore
        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 2048, height: 2048 } }],
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.WEBP,
            base64: false,
          }
        );

        const filename = manipResult.uri.split('/').pop() || `image_${i}.webp`;

        formData.append('images', {
          uri: manipResult.uri,
          type: 'image/webp',
          name: filename,
        } as any);
      } catch (error) {
        console.error(`Errore durante la manipolazione di ${uri}:`, error);
        // Fallback all'immagine originale se la manipolazione fallisce
        const filename = uri.split('/').pop() || `image_${i}.webp`;
        formData.append('images', {
          uri: uri,
          type: 'image/webp',
          name: filename,
        } as any);
      }
    }
    
    try {
      const response = await httpClient.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading property:', error);
      return null;
    }
  };

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema, { errorMap: customErrorMap }) as any, // Applica il resolver con customErrorMap
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
      energyRating: 'NOT_APPLIABLE',
      hasElevator: false,
      hasDisabledAccess: false,
      hasSurveillance: false,
      garden: 'ABSENT',
      isFurnished: false,
      heatingType: 'Absent',
      hasRoadAccess: false,
      parkingSpaces: '0',
      numberOfRooms: '1',
      numberOfBathrooms: '1',
      floor: '0',
      numberOfFloors: '1',
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
            <ListingTypeSelector control={control} name="contractType" rules={{ required: t('addProperty.alerts.selectListingType') }} errors={errors} />
            <Step1_PropertyType control={control} name="propertyType" rules={{ required: t('addProperty.alerts.selectPropertyType') }} errors={errors} />
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
          t("validationError"),
          t("pleaseSelectValidAddressFromSuggestions"),
          [{ text: t("ok") }]
        );
      }
      // Gli errori verranno mostrati automaticamente dai componenti grazie a RHF e alla modalità onBlur/onChange
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Funzione di submit finale
  const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
    if (selectedImages.length === 0) {
      Alert.alert(t("warning"), t("pleaseAddAtLeastOnePropertyImage"));
      return;
    }
    if (isSubmitting) return; // Previene submit multipli
    setIsSubmitting(true);

    console.log('Submitting Data:', data);

    try {
      // 1. Preparazione Dati
      const getCategoryName = (d: PropertyFormData) => {
        switch (d.propertyType) {
          case 'RESIDENTIAL': return d.residentialCategory;
          case 'COMMERCIAL': return d.commercialCategory;
          case 'GARAGE': return d.garageCategory;
          case 'LAND': return d.landCategory;
          default: return '';
        }
      };

      const propertyData: any = {
        propertyType: data.propertyType,
        description: data.description,
        price: parseFloat(data.price),
        area: parseInt(data.area),
        contractType: data.contractType,
        propertyCategoryName: getCategoryName(data),
        condition: data.condition,
        energyRating: data.energyRating,
        addressRequest: data.addressRequest,
      };

      // Aggiungi campi specifici in base al tipo
      switch (data.propertyType) {
        case 'RESIDENTIAL':
          propertyData.numberOfRooms = parseInt(data.numberOfRooms);
          propertyData.numberOfBathrooms = parseInt(data.numberOfBathrooms);
          propertyData.floor = parseInt(data.floor);
          propertyData.numberOfFloors = parseInt(data.numberOfFloors);
          propertyData.garden = data.garden;
          propertyData.heatingType = data.heatingType;
          propertyData.parkingSpaces = data.parkingSpaces ? parseInt(data.parkingSpaces) : 0;
          propertyData.isFurnished = data.isFurnished;
          propertyData.hasElevator = data.hasElevator;
          propertyData.yearBuilt = data.yearBuilt ? parseInt(data.yearBuilt) : undefined;
          break;
        case 'COMMERCIAL':
          propertyData.numberOfRooms = parseInt(data.numberOfRooms);
          propertyData.numberOfBathrooms = parseInt(data.numberOfBathrooms);
          propertyData.floor = parseInt(data.floor);
          propertyData.numberOfFloors = parseInt(data.numberOfFloors);
          propertyData.hasDisabledAccess = data.hasDisabledAccess;
          propertyData.yearBuilt = data.yearBuilt ? parseInt(data.yearBuilt) : undefined;
          break;
        case 'GARAGE':
          propertyData.floor = parseInt(data.floor);
          propertyData.numberOfFloors = parseInt(data.numberOfFloors);
          propertyData.hasSurveillance = data.hasSurveillance;
          propertyData.yearBuilt = data.yearBuilt ? parseInt(data.yearBuilt) : undefined;
          break;
        case 'LAND':
          propertyData.hasRoadAccess = data.hasRoadAccess;
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
            title: t('addProperty.alerts.success'),
            message: t('addProperty.alerts.propertyAdded'),
            buttonLabel: t('addProperty.alerts.backToHome'),
            buttonAction: '/(protected)/(agent)/(tabs)/home', // Reindirizza alla home dell'agente
          },
        });
        return;
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
          title: t('addProperty.alerts.saveError'),
          message: error.message || t('addProperty.alerts.unexpectedError'),
          buttonLabel: t('addProperty.alerts.backToForm'),
          buttonAction: 'back', // Permette di tornare indietro
        },
      });
      return;
    } finally {
      setIsSubmitting(false); // Riabilita il pulsante
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="p-4">
          <View className="mb-6 items-center">
            <ThemedText className="opacity-60 text-xs uppercase font-bold tracking-widest mb-2">
              {t('addProperty.stepCounter', { current: currentStep, total: 5 })}
            </ThemedText>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              size="medium"
              onStepPress={async (step) => {
                if (step < currentStep) {
                  setCurrentStep(step);
                  return;
                }
                
                let canGoToStep = true;
                for (let i = currentStep; i < step; i++) {
                  const fieldsToValidate = fieldsByStep[i];
                  if (fieldsToValidate && fieldsToValidate.length > 0) {
                    const isValid = await trigger(fieldsToValidate);
                    if (!isValid) {
                      canGoToStep = false;
                      setCurrentStep(i);
                      break;
                    }
                  }
                }
                
                if (canGoToStep) {
                  setCurrentStep(step);
                }
              }}
            />
          </View>

          {renderStepContent()}
        </ThemedView>
      </ScrollView>

      {/* Floating Action Buttons Container */}
      <View
        className="absolute bottom-0 left-0 right-0 p-6 flex-row gap-4 border-t"
        style={{
          backgroundColor: backgroundColor,
          borderColor: borderColor + '20'
        }}
      >
        {currentStep > 1 && (
          <ThemedButton
            title={t('addProperty.buttons.back')}
            onPress={prevStep}
            disabled={isSubmitting}
            className="flex-1 py-4 mb-0"
            style={{ backgroundColor: borderColor + '20' }}
            textColor={textColor}
          />
        )}

        {currentStep < 5 ? (
          <ThemedButton
            title={t('addProperty.buttons.next')}
            onPress={nextStep}
            disabled={isSubmitting}
            className="flex-[2] py-4 mb-0 shadow-lg shadow-blue-500/30"
          />
        ) : (
          <ThemedButton
            title={isSubmitting || loading ? t('addProperty.buttons.saving') : t('addProperty.buttons.publish')}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || loading}
            className="flex-[2] py-4 mb-0 shadow-lg shadow-green-500/30"
          >
            {(isSubmitting || loading) && <ActivityIndicator color={buttonTextColor} style={{ marginLeft: 8 }} />}
          </ThemedButton>
        )}
      </View>
    </ThemedView>
  );
}
