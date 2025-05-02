import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FeedbackScreen from '@/components/FeedbackScreen';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';

type FeedbackStatus = 'success' | 'error' | 'info';

export default function FeedbackRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    status?: FeedbackStatus;
    title?: string;
    message?: string;
    buttonLabel?: string;
    buttonAction?: string; // e.g., 'back', 'home', '/(protected)/(agent)/home'
    iconName?: string;
  }>();

  // Default values and validation
  const status = params.status || 'info';
  const title = params.title || 'Informazione';
  const message = params.message || 'Operazione completata.';
  const buttonLabel = params.buttonLabel || 'OK';
  const buttonAction = params.buttonAction || 'back'; // Default action is to go back
  const iconName = params.iconName;

  const handleButtonPress = () => {
    if (buttonAction === 'back') {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback if cannot go back (e.g., deep link entry)
        router.replace('/'); // Navigate to a default safe route
      }
    } else {
      // Assume buttonAction is a path - Cast to any to satisfy Href type
      router.replace(buttonAction as any);
    }
  };

  // Basic check if essential params are missing (could be more robust)
  if (!params.status || !params.title || !params.message) {
     console.warn("FeedbackScreen route called with missing parameters:", params);
     // Optionally render a default error message or navigate back immediately
     return (
        <ThemedView className="flex-1 items-center justify-center p-8">
            <ThemedText>Errore: Parametri mancanti per la schermata di feedback.</ThemedText>
            <ThemedButton title="Indietro" onPress={() => router.back()} />
        </ThemedView>
     );
  }


  return (
    <FeedbackScreen
      status={status}
      title={title}
      message={message}
      buttonLabel={buttonLabel}
      onButtonPress={handleButtonPress}
      iconName={iconName}
    />
  );
}
