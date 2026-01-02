import React from 'react';
import AgendaScreen from '@/components/Agent/Agenda/AgendaScreen';
import { ThemedView } from '@/components/ThemedView';

export default function AgendaScreenWrapper() {
  return (
    <ThemedView className="flex-1">
      <AgendaScreen />
    </ThemedView>
  );
}