import { Stack } from 'expo-router';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor'; // Assicurati che il percorso sia corretto

export default function AgentLayout() {
  const backgroundColor = useThemeColor({}, 'background'); // Esempio di colore scuro
  const tintColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        headerTitleStyle: {
          fontFamily: 'Poppins', // Suggerimento: 'Poppins' è un font moderno e minimale
          fontSize: 17,
          fontWeight: '600',
          color: tintColor, // Usa il colore del tema per il titolo
        },
        headerStyle: {
          backgroundColor: backgroundColor, // Usa il colore di sfondo del tema
        },
        headerTintColor: tintColor, // Usa il colore del tema per icone e back button
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="add-property"
        options={{
          headerShown: true,
          title: 'Nuova Proprietà',
          headerBackTitle: 'Annulla',
          // Le opzioni headerStyle, headerTitleStyle, headerTintColor ereditate da screenOptions
          // verranno applicate automaticamente qui, usando i colori del tema.
        }}
      />
    </Stack>
  );
}
