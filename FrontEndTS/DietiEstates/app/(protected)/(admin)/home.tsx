import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function AdminHome() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText style={{ fontSize: 20 }}>Admin Dashboard</ThemedText>
    </ThemedView>
  );
}
