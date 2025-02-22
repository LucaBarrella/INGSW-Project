import React from 'react';
import PropertyDashboard from '@/components/Agent/PropertyDashboard/PropertyDashboard';
import { ThemedView } from '@/components/ThemedView';

export default function DashboardScreen() {

  return (
    <ThemedView className="flex-1">
      <PropertyDashboard />
    </ThemedView>
  );
}
