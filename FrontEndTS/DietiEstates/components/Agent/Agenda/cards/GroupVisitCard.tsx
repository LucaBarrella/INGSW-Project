import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../../../types/agenda';
import { useThemeColor } from '@/hooks/useThemeColor';

interface GroupVisitCardProps {
  appointments: Appointment[];
}

const GroupVisitCard: React.FC<GroupVisitCardProps> = ({ appointments }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estrai le informazioni comuni dal primo appuntamento
  const firstAppointment = appointments[0];
  const { startTime, endTime, property } = firstAppointment;

  // Colleziona tutti i clienti da tutti gli appuntamenti nel gruppo
  const clients = appointments.map(app => app.client);

  const time = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')} - ${endTime.getHours()}:${String(endTime.getMinutes()).padStart(2, '0')}`;

  const cardBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const cardBorderColor = useThemeColor({}, 'tabBarBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const conflictColor = useThemeColor({}, 'error');

  return (
    <View className="shadow-md rounded-lg p-3 border" style={{ backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View className="flex-row justify-between items-center">
            <Text style={{ color: textColor }} className="text-base font-bold">Visita di Gruppo</Text>
            <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color={secondaryTextColor} />
                <Text style={{ color: secondaryTextColor }} className="text-sm font-bold ml-1">{clients.length}</Text>
            </View>
        </View>
        <Text style={{ color: secondaryTextColor }} className="text-xs mb-2">{time}</Text>
        
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={14} color={secondaryTextColor} />
          <Text style={{ color: secondaryTextColor }} className="ml-1.5 text-sm flex-shrink">{property.address}</Text>
        </View>
        <View className="flex-row items-start mt-1">
          <Ionicons name="people-outline" size={14} color={secondaryTextColor} />
          <Text style={{ color: secondaryTextColor }} className="ml-1.5 text-sm font-semibold flex-1">
            {clients.map(c => c.name).join(', ')}
          </Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View className="mt-3 pt-3 border-t" style={{ borderColor: cardBorderColor + '99' }}>
          <TouchableOpacity className="flex-row items-center justify-center">
            <Ionicons name="trash-outline" size={18} color={conflictColor} />
            <Text style={{ color: conflictColor }} className="font-bold ml-2 text-sm">Cancel Visit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GroupVisitCard;

