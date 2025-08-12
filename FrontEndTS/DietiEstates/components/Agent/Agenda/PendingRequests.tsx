import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VisitRequest } from '../../../types/agenda';
import RequestCard from './RequestCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PendingRequestsProps {
  requests: VisitRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  isRequestsVisible: boolean;
  toggleRequestsVisibility: () => void;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ requests, onAccept, onDecline, isRequestsVisible, toggleRequestsVisibility }) => {
  const textColor = useThemeColor({}, 'text');
  const blueColor = useThemeColor({}, 'info'); // Assuming 'info' color can be used for blue elements

  return (
    <ThemedView className="p-4">
      <TouchableOpacity onPress={toggleRequestsVisibility} className="mb-4">
        <ThemedView className="flex-row justify-between items-center">
          <ThemedView className="flex-row items-center">
            <Text style={{ color: textColor }} className="text-lg font-bold">Pending Requests</Text>
            <ThemedView className="ml-3 rounded-full w-7 h-7 items-center justify-center shadow-md" style={{ backgroundColor: blueColor }}>
              <ThemedText type="defaultSemiBold" style={{ color: useThemeColor({}, 'white') }}>{requests.length}</ThemedText>
            </ThemedView>
          </ThemedView>
          <Ionicons name={isRequestsVisible ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color={textColor} />
        </ThemedView>
      </TouchableOpacity>

      {isRequestsVisible && (
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <ThemedView className="px-4 mb-4">
              <RequestCard
                request={item}
                onAccept={() => onAccept(item.id)}
                onDecline={() => onDecline(item.id)}
              />
            </ThemedView>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </ThemedView>
  );
};

export default PendingRequests;