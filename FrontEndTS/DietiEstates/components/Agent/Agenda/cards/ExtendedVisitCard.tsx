import React from 'react';
import { View, Text } from 'react-native';
import { Appointment } from '../../../../types/agenda';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExtendedVisitCardProps {
  appointment: Appointment;
}

const ExtendedVisitCard: React.FC<ExtendedVisitCardProps> = ({ appointment }) => {
  const formatTime = (date: Date) => date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  const extendedVisitBorderColor = useThemeColor({}, 'info');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');

  return (
    <View className="mb-4">
      <BlurView intensity={90} tint="light" className="rounded-lg overflow-hidden">
        <View className="p-3 border-l-4" style={{ borderColor: extendedVisitBorderColor }}>
          <Text style={{ color: textColor }} className="font-bold">Extended Visit</Text>
          <Text style={{ color: secondaryTextColor }}>{appointment.property.address} with {appointment.client.name}</Text>
          <Text style={{ color: secondaryTextColor }} className="text-xs">{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</Text>
        </View>
      </BlurView>
    </View>
  );
};

export default ExtendedVisitCard;