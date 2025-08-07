import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Offer } from '@/app/_services/__mocks__/offersMockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusInfo = (status: Offer['status']): { color: string; icon: IconName; text: string } => {
    switch (status) {
      case 'accettata':
        return {
          color: colors.visitStatusAccepted,
          icon: 'checkmark-circle',
          text: 'Accettata',
        };
      case 'rifiutata':
        return {
          color: colors.visitStatusRejected,
          icon: 'close-circle',
          text: 'Rifiutata',
        };
      case 'in attesa':
        return {
          color: colors.visitStatusPending,
          icon: 'time',
          text: 'In attesa',
        };
      default:
        return {
          color: colors.text, // Colore di default o errore
          icon: 'help-circle', // Icona di default
          text: 'Sconosciuto',
        };
    }
  };

  const statusInfo = getStatusInfo(offer.status);

  return (
    <ThemedView className="flex-row items-start justify-between gap-4 p-4 rounded-lg">
      <ThemedView className="flex-[2_2_0px] flex-col gap-2">
        <ThemedView className="flex-row items-center mb-2">
          <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} style={{ marginRight: 5 }} />
          <ThemedText className="text-lg font-bold" style={{ color: statusInfo.color }}>{statusInfo.text}</ThemedText>
        </ThemedView>
        <ThemedText className="text-2xl font-bold text-gray-800 mb-2">{offer.address}</ThemedText>
        <ThemedText className="text-base text-gray-600">Importo: {offer.amount}</ThemedText>
        <ThemedText className="text-base text-gray-600">Inviata: {offer.date}</ThemedText>
        <ThemedText className="text-base text-gray-600 mt-2">{offer.actionDescription}</ThemedText>
        <TouchableOpacity
          className="flex-row items-center justify-center self-start mt-4 px-6 py-3 rounded-full"
          style={{ backgroundColor: colors.buttonBackground }}
        >
          <ThemedText className="text-base font-bold mr-2" style={{ color: colors.buttonTextColor }}>{offer.actionText}</ThemedText>
          <Ionicons name={offer.actionIcon} size={20} color={colors.buttonTextColor} />
        </TouchableOpacity>
      </ThemedView>
      <Image source={{ uri: offer.imageUrl }} className="w-36 h-full rounded-2xl" resizeMode="cover" />
    </ThemedView>
  );
};

export default OfferCard;