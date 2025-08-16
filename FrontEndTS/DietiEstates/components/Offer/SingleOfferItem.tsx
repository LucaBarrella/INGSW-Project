import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, OfferStatus } from '@/types/offers';

interface SingleOfferItemProps {
  offer: Offer;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

const SingleOfferItem: React.FC<SingleOfferItemProps> = ({
  offer,
  onAccept,
  onReject,
}) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const brandColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: OfferStatus): string => {
    switch (status) {
      case OfferStatus.Accepted:
        return successColor;
      case OfferStatus.Rejected:
        return errorColor;
      case OfferStatus.Active:
        return brandColor;
      default:
        return textColor;
    }
  };

  const getStatusText = (status: OfferStatus): string => {
    switch (status) {
      case OfferStatus.Accepted:
        return 'Accettata';
      case OfferStatus.Rejected:
        return 'Rifiutata';
      case OfferStatus.Active:
        return 'Attiva';
      default:
        return status;
    }
  };

  return (
    <ThemedView
      className="p-4 mb-3 rounded-xl border"
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <ThemedText className="text-lg font-bold" style={{ color: textColor }}>
            {formatCurrency(offer.amount)}
          </ThemedText>
          <ThemedText className="text-sm" style={{ color: textColor }}>
            Offerta del {formatDate(offer.createdAt)}
          </ThemedText>
        </View>
        <View className="flex items-end">
          <Text
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: getStatusColor(offer.status) + '20',
              color: getStatusColor(offer.status),
            }}
          >
            {getStatusText(offer.status)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <Ionicons name="person-outline" size={16} color={textColor} />
        <ThemedText className="ml-2 text-sm" style={{ color: textColor }}>
          {offer.buyer.name}
        </ThemedText>
      </View>

      {offer.status === OfferStatus.Active && (
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: errorColor + '20',
              borderColor: errorColor,
            }}
            onPress={() => onReject(offer.id)}
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
            onPress={() => onAccept(offer.id)}
          >
            <ThemedText className="text-sm font-medium" style={{ color: 'white' }}>
              Accetta
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
};

export default SingleOfferItem;