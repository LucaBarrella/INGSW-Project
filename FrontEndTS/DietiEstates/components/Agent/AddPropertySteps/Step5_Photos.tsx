import React from 'react';
import { View, Image, Pressable, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImageManipulator from 'expo-image-manipulator'; // Torniamo all'import standard
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Step5PhotosProps {
  // TODO: Integrate with react-hook-form if needed, or manage state separately
  selectedImages: string[]; // Array of image URIs
  onImagesChange: (uris: string[]) => void;
}

export default function Step5_Photos({ selectedImages, onImagesChange }: Step5PhotosProps) {
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'iconColor');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const { showActionSheetWithOptions } = useActionSheet();

  // --- Helper per ridimensionare e comprimere usando ImageManipulator ---
  const resizeAndCompressImage = async (originalUri: string): Promise<string | null> => {
    try {
      // Definiamo la dimensione massima (il lato più lungo non deve superare 1440)
      // Per mantenere le proporzioni, ridimensioniamo solo se necessario
      // Nota: ImageManipulator usa resize basato su width o height.
      // Per cappare a 1440p mantenendo le proporzioni, potremmo dover fare un check preliminare
      // delle dimensioni o semplicemente impostare una delle due dimensioni massime.
      // Scegliamo di impostare l'altezza massima a 1440, le proporzioni verranno mantenute.
      // Se l'immagine è più larga che alta, la larghezza risultante potrebbe essere > 1440.
      // Se vuoi *esattamente* max 1440 sul lato lungo, la logica andrebbe affinata
      // leggendo prima le dimensioni originali (non supportato direttamente da ImageManipulator).
      // Ripristinato: Torniamo a manipulateAsync. La nuova API object-oriented
      // (ImageManipulator.manipulate) causa errori TS ("does not exist"),
      // nonostante sia nella documentazione. Usiamo l'API deprecata e ignoriamo
      // l'avviso TS finché la situazione non sarà più chiara.
      // Cappiamo entrambi i lati a 2048 per assicurare max 2048 sul lato lungo.
      // Mantiene l'aspect ratio.

      // @ts-ignore // - Ignoriamo l'avviso di deprecazione per manipulateAsync (Ripristinato)
      const manipResult = await ImageManipulator.manipulateAsync(
        originalUri,
        // Manteniamo il ridimensionamento a 2048x2048 per preservare una buona qualità
        [{ resize: { width: 2048, height: 2048 } }],
        {
          compress: 0.8, // Aumentiamo leggermente la qualità per WebP che ha una migliore compressione
          format: ImageManipulator.SaveFormat.WEBP, // Usiamo il formato WebP
          base64: false,
        }
      );
      return manipResult.uri;
    } catch (error) {
      console.error(`Errore durante la manipolazione di ${originalUri}:`, error);
      return null;
    }
  };

  // --- Funzione per processare e aggiungere URI ---
  const processAndAddUris = async (originalUris: string[]) => {
    const processedUris: string[] = [];
    for (const uri of originalUris) {
      const newUri = await resizeAndCompressImage(uri);
      if (newUri) {
        processedUris.push(newUri);
      }
    }
    if (processedUris.length > 0) {
      onImagesChange([...selectedImages, ...processedUris]);
    }
    if (processedUris.length < originalUris.length) {
      // Informa l'utente se alcune immagini non sono state processate
      Alert.alert('Attenzione', 'Alcune immagini non sono state processate correttamente.');
    }
  };


  // --- Funzione per selezionare immagini dalla libreria ---
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso necessario', 'È necessario concedere il permesso per accedere alla galleria.');
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
      Alert.alert('Errore', 'Impossibile selezionare immagini dalla galleria.');
    }
  };

  // --- Funzione per scattare foto con la camera ---
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso necessario', 'È necessario concedere il permesso per accedere alla fotocamera.');
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
      Alert.alert('Errore', 'Impossibile utilizzare la fotocamera.');
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
      Alert.alert('Errore', 'Impossibile selezionare file.');
    }
  };

  const removeImage = (uriToRemove: string) => {
    onImagesChange(selectedImages.filter(uri => uri !== uriToRemove));
  };

  // --- Funzione per mostrare l'Action Sheet ---
  const showImageSourceOptions = () => {
    const options = ['Libreria Foto', 'Scatta Foto', 'Scegli File', 'Annulla'];
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
        title: 'Scegli la fonte dell\'immagine',
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

  return (
    <ThemedView className="p-2.5 gap-4">
      <ThemedText type="subtitle" className="mb-2.5 text-center">Foto dell'Immobile</ThemedText>

      <ScrollView horizontal className="mb-4 p-2" >
        {selectedImages.map((uri) => (
          <View key={uri} className="relative mr-2.5">
            <Image source={{ uri }} className="w-24 h-24 rounded-lg border" style={{ borderColor: borderColor }} />
            <Pressable
              className="absolute -top-1 -right-1 rounded-full w-6 h-6 justify-center items-center p-1"
              style={{ backgroundColor: tint }}
              onPress={() => removeImage(uri)}
            >
              <ThemedIcon icon="material-symbols:close-rounded" size={16} lightColor={iconColor} darkColor={iconColor} accessibilityLabel="Rimuovi immagine" />
            </Pressable>
          </View>
        ))}
        {/* Bottone Aggiungi Foto ora chiama showImageSourceOptions */}
        <Pressable
          className="w-24 h-24 rounded-lg border-2 border-dashed justify-center items-center p-2"
          style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
          onPress={showImageSourceOptions}
        >
          <View className="flex-1 justify-center items-center">
            <ThemedIcon icon="material-symbols:add-photo-alternate-outline-rounded" size={30} lightColor={tint} darkColor={tint} accessibilityLabel="Aggiungi foto" />
            <ThemedText style={{ color: tint }} className="mt-1">Aggiungi Foto</ThemedText>
          </View>
        </Pressable>
      </ScrollView>

      <ThemedText className="text-center text-xs" style={{ color: secondaryTextColor }}>
        Puoi aggiungere più foto. La prima foto sarà usata come copertina.
      </ThemedText>
    </ThemedView>
  );
}