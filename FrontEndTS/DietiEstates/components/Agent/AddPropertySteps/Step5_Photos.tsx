import React, { useCallback } from 'react';
import { View, Image, Pressable, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Sortable, { SortableGridRenderItem, SortableGridDragEndParams } from 'react-native-sortables';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import Animated, { FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { t } from 'i18next';

interface Step5PhotosProps {
  selectedImages: string[];
  onImagesChange: (uris: string[]) => void;
}

export default function Step5_Photos({ selectedImages, onImagesChange }: Step5PhotosProps) {
  const tint = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'propertyCardBackground');
  const borderColor = useThemeColor({}, 'border');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const { showActionSheetWithOptions } = useActionSheet();

  // --- Funzione per processare e aggiungere URI ---
  const processAndAddUris = async (originalUris: string[]) => {
    const MAX_PHOTOS = 20;
    const remainingSlots = MAX_PHOTOS - selectedImages.length;

    if (remainingSlots <= 0) {
      Alert.alert(t('addProperty.alerts.attention'), t('addProperty.alerts.maxPhotosReached', { max: MAX_PHOTOS }));
      return;
    }

    const urisToAdd = originalUris.slice(0, remainingSlots);
    
    if (urisToAdd.length > 0) {
      onImagesChange([...selectedImages, ...urisToAdd]);
    }

    if (originalUris.length > remainingSlots) {
      Alert.alert(t('addProperty.alerts.attention'), t('addProperty.alerts.someImagesSkipped', { max: MAX_PHOTOS }));
    }
  };


  // --- Funzione per selezionare immagini dalla libreria ---
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('addProperty.alerts.permissionRequired'), t('addProperty.alerts.galleryPermission'));
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const originalUris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
        await processAndAddUris(originalUris); // Processa e aggiunge
      }
    } catch (error) {
      console.error("Errore durante la selezione da libreria:", error);
      Alert.alert(t('addProperty.alerts.error'), t('addProperty.alerts.galleryError'));
    }
  };

  // --- Funzione per scattare foto con la camera ---
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('addProperty.alerts.permissionRequired'), t('addProperty.alerts.cameraPermission'));
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const originalUris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
        await processAndAddUris(originalUris); // Processa e aggiunge
      }
    } catch (error) {
      console.error("Errore durante lo scatto della foto:", error);
      Alert.alert(t('addProperty.alerts.error'), t('addProperty.alerts.cameraError'));
    }
  };

  // --- Funzione per selezionare file (documenti/immagini) ---
  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Permette solo immagini, usa '*/*' per tutti i file
        copyToCacheDirectory: true, // Necessario per ottenere un URI accessibile
        multiple: true, // Permette selezione multipla
      });

      // Gestione nuovo output DocumentPicker (SDK >= 48)
      if (result.canceled === false && result.assets) {
         const newUris = result.assets
           .filter(asset => asset.uri)
           .map(asset => asset.uri);
        await processAndAddUris(newUris); // Corretto: usa newUris
      }

    } catch (error) {
      console.error("Errore durante la selezione del documento:", error);
      Alert.alert(t('addProperty.alerts.error'), t('addProperty.alerts.fileError'));
    }
  };

  const removeImage = (uriToRemove: string) => {
    onImagesChange(selectedImages.filter(uri => uri !== uriToRemove));
  };

  // --- Funzione per mostrare l'Action Sheet ---
  const showImageSourceOptions = () => {
    const options = [t('addProperty.alerts.photoLibrary'), t('addProperty.alerts.takePhoto'), t('addProperty.alerts.chooseFile'), t('addProperty.actions.cancelTitle')];
    const cancelButtonIndex = 3;
    const icons = [
      <ThemedIcon key="library" icon="material-symbols:photo-library-outline-rounded" size={24} accessibilityLabel="Libreria" />,
      <ThemedIcon key="camera" icon="material-symbols:camera-alt-outline-rounded" size={24} accessibilityLabel="Camera" />,
      <ThemedIcon key="file" icon="material-symbols:attach-file-rounded" size={24} accessibilityLabel="File" />,
      <ThemedIcon key="cancel" icon="material-symbols:cancel-outline-rounded" size={24} accessibilityLabel="Annulla" />
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: t('addProperty.alerts.chooseImageSource'),
        // Aggiungiamo icone per un aspetto migliore (opzionale)
        icons: Platform.OS === 'ios' ? icons : undefined, // Le icone sono più comuni su iOS
        // Stili (opzionali, per personalizzare)
        // textStyle: { color: 'blue' },
        // titleTextStyle: { fontWeight: 'bold' },
        // containerStyle: { backgroundColor: 'lightgrey' },
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0: // Libreria Foto
            pickImage();
            break;
          case 1: // Scatta Foto
            takePhoto();
            break;
          case 2: // Scegli File
            pickDocument();
            break;
          case cancelButtonIndex:
          // Canceled
          default:
            break;
        }
      }
    );
  };

  const handleDragEnd = (params: SortableGridDragEndParams<string>) => {
    onImagesChange(params.data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderPhotoItem = useCallback<SortableGridRenderItem<string>>(({ item: uri, index }) => {
    const isCover = index === 0;
    return (
      <View className="w-28 h-28">
        <View
          className="w-full h-full rounded-2xl border-2 overflow-hidden relative"
          style={{ borderColor: isCover ? tint : borderColor }}
        >
          <Image
            source={{ uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isCover && (
            <View
              className="absolute bottom-0 left-0 right-0 py-1 items-center"
              style={{ backgroundColor: tint }}
            >
              <ThemedText className="text-[9px] font-bold text-white uppercase tracking-widest">{t('addProperty.labels.cover')}</ThemedText>
            </View>
          )}
        </View>

        <Pressable
          className="absolute -top-1.5 -right-1.5 rounded-full w-6 h-6 justify-center items-center shadow-md z-50"
          style={{ backgroundColor: '#FF3B30' }}
          onPress={() => removeImage(uri)}
        >
          <ThemedIcon icon="material-symbols:close-rounded" size={16} lightColor="#FFFFFF" darkColor="#FFFFFF" accessibilityLabel="Rimuovi" />
        </Pressable>
      </View>
    );
  }, [tint, borderColor, removeImage]);

  return (
    <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
      <ThemedView className="p-4 gap-4">
        {/* Header Section */}
        <View className="flex-row items-center gap-3 mb-2">
          <View className="p-2.5 rounded-full shadow-sm" style={{ backgroundColor: cardBackground, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
            <ThemedIcon icon="material-symbols:add-a-photo" size={26} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.location')} />
          </View>
          <View>
            <ThemedText type="subtitle" className="text-xl font-bold">{t('addProperty.headers.propertyPhotos')}</ThemedText>
            <ThemedText className="text-sm opacity-60">{t('addProperty.stepCounter', { current: 5, total: 5 })}</ThemedText>
          </View>
        </View>

        <View
          className="p-5 rounded-3xl border-2"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 3
          }}
        >
          <View className="flex-row flex-wrap gap-4 justify-center">
            {selectedImages && selectedImages.length > 0 && (
              <Sortable.Grid
                columns={3}
                data={selectedImages}
                renderItem={renderPhotoItem}
                onDragEnd={handleDragEnd}
                columnGap={16}
                rowGap={16}
              />
            )}
            
            <Pressable
              className="w-28 h-28 rounded-2xl border-2 border-dashed justify-center items-center p-2 active:opacity-60"
              style={{ borderColor: tint + '40', backgroundColor: tint + '05' }}
              onPress={showImageSourceOptions}
            >
              <ThemedIcon icon="material-symbols:add-photo-alternate-outline-rounded" size={32} lightColor={tint} darkColor={tint} accessibilityLabel={t('addProperty.accessibility.addPhoto')} />
              <ThemedText style={{ color: tint }} className="mt-1 text-xs font-bold text-center">{t('addProperty.labels.add')}</ThemedText>
            </Pressable>
          </View>

          <View className="p-5 rounded-3xl border-2 flex-row items-start gap-3 mt-6" style={{ backgroundColor: cardBackground, borderColor: borderColor }}>
            <ThemedIcon icon="material-symbols:info-outline" size={20} lightColor={secondaryTextColor} darkColor={secondaryTextColor} accessibilityLabel={t('addProperty.accessibility.info')} />
            <ThemedText className="flex-1 text-xs leading-4" style={{ color: secondaryTextColor }}>
              {t('addProperty.info.dragToReorder')}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Animated.View>
  );
}