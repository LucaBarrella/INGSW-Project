import React from 'react';
import { useBuyerVisits } from '@/src/hooks/useBuyerVisits';
import { VisitDTO } from '@/src/dto/VisitDTO';
import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';

export default function VisitsTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const { visits, loading, error } = useBuyerVisits();
  const { t } = useTranslation();
  const getStatusColor = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING':
        return '#F59E0B'; // yellow
      case 'CONFIRMED':
        return '#10B981'; // green
      case 'CANCELLED':
        return '#6B7280'; // gray
      case 'REJECTED':
        return '#EF4444'; // red
      default:
        return '#9CA3AF'; // default gray
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ThemedView className="p-4 bg-white">
        <ThemedText className="text-xl font-semibold">
          {t('your_visits')}
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
              <ThemedView key={visit.visit.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <ThemedText className="text-lg font-semibold">{t('date')}: {new Date(visit.visit.startTime).toLocaleDateString()}</ThemedText>
                <ThemedText>{t('time')}: {new Date(visit.visit.startTime).toLocaleTimeString()}</ThemedText>
                <ThemedText>{t('address')}: {visit.address.city} ({visit.address.country}) {visit.address.street} {visit.address.streetNumber}</ThemedText>
                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <ThemedText><ThemedView
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 6,
                      backgroundColor: getStatusColor(visit.visit.status),
                      margin: 8,
                    }}
                  /> {t(`visit_status.${visit.visit.status.toUpperCase()}`)}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}
