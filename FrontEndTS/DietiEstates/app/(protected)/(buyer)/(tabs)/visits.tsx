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

  // TODO: Replace with real data
  const mockVisits: Visit[] = [
    {
      id: '1',
      propertyTitle: 'Villa Moderna',
      date: '2024-03-01',
      time: '15:00',
      status: 'confirmed',
      address: 'Via Roma 123, Milano'
    },
    {
      id: '2',
      propertyTitle: 'Attico di Lusso',
      date: '2024-03-03',
      time: '11:30',
      status: 'pending',
      address: 'Via Montenapoleone 1, Milano'
    }
  ];

  const getStatusColor = (status: Visit['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: Visit['status']) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Cancellata';
      case 'completed': return 'Completata';
      default: return status;
    }
  };

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
        {mockVisits.length === 0 ? (
          <ThemedText className="text-center text-gray-500">
            Non hai ancora prenotato visite
          </ThemedText>
        ) : (
          mockVisits.map(visit => (
            <ThemedView 
              key={visit.id}
              className="mb-4 p-4 rounded-lg bg-white"
              style={{ borderWidth: 1, borderColor }}
            >
              <ThemedText className="text-lg font-semibold mb-2">
                {visit.propertyTitle}
              </ThemedText>
              <ThemedText className="text-gray-600 mb-2">
                {visit.address}
              </ThemedText>
              <ThemedText className="text-gray-600">
                Data: {new Date(visit.date).toLocaleDateString('it-IT')} - {visit.time}
              </ThemedText>
              <ThemedText className={`mt-2 font-semibold ${getStatusColor(visit.status)}`}>
                {getStatusText(visit.status)}
              </ThemedText>
            </ThemedView>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}
