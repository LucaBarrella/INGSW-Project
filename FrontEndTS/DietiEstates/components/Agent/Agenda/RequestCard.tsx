import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { VisitRequest } from '../../../types/agenda';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BlurView } from 'expo-blur';

interface RequestCardProps {
  request: VisitRequest;
  onAccept: () => void;
  onDecline: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onDecline }) => {
  const { property, requestedTime, status, isGroupOpportunity } = request;

  const conflictColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');
  const infoColor = useThemeColor({}, 'info');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const cardBackgroundColor = useThemeColor({}, 'propertyCardBackground');
  const backgroundMuted = useThemeColor({}, 'backgroundMuted');

  const getStatusInfo = () => {
    if (status === 'conflicting') {
      return {
        color: conflictColor,
        text: `Conflict with existing ${new Date(requestedTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} visit`,
      };
    }
    if (isGroupOpportunity) {
      return {
        color: successColor,
        text: 'Opportunity to form group visit',
      };
    }
    return {
      color: infoColor,
      text: 'Standard new request',
    };
  };

  const statusInfo = getStatusInfo();

  const CardContent = () => (
    <ThemedView style={{ backgroundColor: 'transparent', borderLeftColor: statusInfo.color }} className={`p-3 flex-row items-center border-l-4`}>
        <ThemedView className="flex-1" style={{ backgroundColor: 'transparent' }}>
            <ThemedText className="font-bold">{`${new Date(requestedTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${property.address}`}</ThemedText>
            <ThemedText style={{ color: secondaryTextColor }} className="text-xs">{statusInfo.text}</ThemedText>
        </ThemedView>
        <ThemedView className="flex-row" style={{ backgroundColor: 'transparent' }}>
            <TouchableOpacity onPress={onAccept} style={{ backgroundColor: successColor }} className="p-2 rounded-full mr-2">
            <Ionicons name="checkmark" size={20} color={backgroundMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={{ backgroundColor: conflictColor }} className="p-2 rounded-full">
            <Ionicons name="close" size={20} color={backgroundMuted} />
            </TouchableOpacity>
        </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={{ backgroundColor: cardBackgroundColor, borderRadius: 12, overflow: 'hidden' }}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={{ borderRadius: 12, overflow: 'hidden' }}>
          <CardContent />
        </BlurView>
      ) : (
        <CardContent />
      )}
    </ThemedView>
  );
};

export default RequestCard;