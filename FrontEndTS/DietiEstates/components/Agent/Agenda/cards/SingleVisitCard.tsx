import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../../../types/agenda';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SingleVisitCardProps {
  appointment: Appointment;
  isConflict?: boolean;
}

const SingleVisitCard: React.FC<SingleVisitCardProps> = ({ appointment, isConflict }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const conflictColor = useThemeColor({}, 'errorIcon');
  const conflictBgColor = useThemeColor({}, 'errorBackground');
  const conflictBorderColor = useThemeColor({}, 'errorIcon');
  const conflictTextColor = useThemeColor({}, 'errorText');
  const cardBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const cardBorderColor = useThemeColor({}, 'tabBarBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  
  const time = `${appointment.startTime.getHours()}:${String(appointment.startTime.getMinutes()).padStart(2, '0')} - ${appointment.endTime.getHours()}:${String(appointment.endTime.getMinutes()).padStart(2, '0')}`;

  return (
    <View style={{
      backgroundColor: isConflict ? conflictBgColor : cardBackgroundColor,
      borderColor: isConflict ? conflictBorderColor : cardBorderColor,
      borderWidth: 1
    }} className="shadow rounded-lg p-3">
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={{ color: isConflict ? conflictTextColor : textColor }} className="text-base font-bold">{isConflict ? 'CONFLICT' : 'Single Visit'}</Text>
        <Text style={{ color: isConflict ? conflictTextColor : secondaryTextColor }} className="text-xs mb-2">{time}</Text>
        
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={14} color={isConflict ? conflictColor : secondaryTextColor} />
          <Text style={{ color: isConflict ? conflictTextColor : secondaryTextColor }} className="ml-1.5 text-sm flex-shrink">{appointment.property.address}</Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="person-outline" size={14} color={isConflict ? conflictColor : secondaryTextColor} />
          <Text style={{ color: isConflict ? conflictTextColor : textColor }} className="ml-1.5 text-sm font-semibold">{appointment.client.name}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View className="mt-3 pt-3 border-t" style={{ borderColor: cardBorderColor + '99' }}>
          <TouchableOpacity className="flex-row items-center justify-center">
            <Ionicons name="trash-outline" size={18} color={conflictColor} />
            <Text style={{ color: conflictTextColor }} className="font-bold ml-2 text-sm">Cancel Visit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SingleVisitCard;
