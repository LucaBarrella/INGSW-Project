import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface OfferActionsProps {
  offerId: string;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

const OfferActions: React.FC<OfferActionsProps> = ({
  offerId,
  onAccept,
  onReject,
}) => {
  const brandColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor({}, 'error');

  return (
    <View className="flex-row gap-3">
      <TouchableOpacity
        className="flex-1 h-10 rounded-lg flex items-center justify-center border"
        style={{
          backgroundColor: errorColor + '20',
          borderColor: errorColor,
        }}
        onPress={() => onReject(offerId)}
      >
        <ThemedText className="text-sm font-medium" style={{ color: errorColor }}>
          Rifiuta
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 h-10 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: brandColor,
        }}
        onPress={() => onAccept(offerId)}
      >
        <ThemedText className="text-sm font-medium" style={{ color: 'white' }}>
          Accetta
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default OfferActions;