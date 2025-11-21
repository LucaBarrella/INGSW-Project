import React from 'react';
import { useBuyerVisits } from '@/src/hooks/useBuyerVisits';
import { VisitDTO } from '@/src/dto/VisitDTO';
import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';

interface Visit {
  id: string;
  propertyId: string;
  buyerId: string;
  agentId: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VisitsTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const { user } = useAuth();
  const { visits, loading, error } = useBuyerVisits();


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
        {loading ? (
          <ThemedText className="text-center text-gray-500">Loading visits...</ThemedText>
        ) : error ? (
          <ThemedText className="text-center text-red-500">Error: {error.message}</ThemedText>
        ) : visits && visits.length === 0 ? (
          <ThemedText className="text-center text-gray-500">No visits found.</ThemedText>
        ) : (
          <ThemedView>
            {visits && visits.map((visit: VisitDTO) => (
              <ThemedView key={visit.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <ThemedText className="text-lg font-semibold">Visit ID: {visit.id}</ThemedText>
                <ThemedText>Date: {new Date(visit.scheduledDate).toLocaleDateString()}</ThemedText>
                <ThemedText>Time: {new Date(visit.scheduledDate).toLocaleTimeString()}</ThemedText>
                <ThemedText>Status: {visit.status}</ThemedText>
                {visit.notes && <ThemedText>Notes: {visit.notes}</ThemedText>}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}
