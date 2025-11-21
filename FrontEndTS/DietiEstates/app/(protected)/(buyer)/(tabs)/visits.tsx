import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Visit {
  id: string;
  propertyTitle: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
}

export default function VisitsTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  // DA SISTEMARE: Implementare chiamata API reale per ottenere le visite dell'utente
  const visits: Visit[] = [];

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ThemedView className="p-4 bg-white">
        <ThemedText className="text-xl font-semibold">
          Le tue Visite
        </ThemedText>
      </ThemedView>
      
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {visits.length === 0 ? (
          <ThemedText className="text-center text-gray-500">
            DA SISTEMARE: Implementare recupero visite reali dal server
          </ThemedText>
        ) : (
          // DA SISTEMARE: Implementare rendering delle visite reali
          <></>
        )}
      </ScrollView>
    </ThemedView>
  );
}
