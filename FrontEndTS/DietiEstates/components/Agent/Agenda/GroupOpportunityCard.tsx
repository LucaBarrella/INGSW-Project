import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VisitRequest } from '../../../types/agenda';

interface GroupOpportunityCardProps {
  groupRequest: VisitRequest;
  onConfirm: () => void;
  onDecline: () => void;
}

const GroupOpportunityCard: React.FC<GroupOpportunityCardProps> = ({ groupRequest, onConfirm, onDecline }) => {
  const { property, potentialClients, requestedTime } = groupRequest;

  return (
    <View className="p-4 rounded-lg shadow-md mb-4 bg-blue-50 border-l-4 border-blue-500">
      <Text className="text-lg font-bold text-blue-800 mb-2">Opportunità di Gruppo!</Text>
      <View className="mb-3">
        <Text className="text-base font-semibold text-gray-800">{property.address}</Text>
        <Text className="text-sm text-gray-600">{potentialClients.length} clienti interessati</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Orario proposto: {new Date(requestedTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={onDecline}
          className="bg-gray-400 py-2 px-4 rounded-md mr-2"
        >
          <Text className="text-white font-semibold">Ignora</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          className="bg-blue-500 py-2 px-4 rounded-md"
        >
          <Text className="text-white font-semibold">Crea Gruppo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GroupOpportunityCard;