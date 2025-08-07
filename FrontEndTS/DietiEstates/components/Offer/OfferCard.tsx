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
    <ThemedView className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden m-4 border-[1px] border-gray-200 dark:border-gray-700">
      <ThemedView className="relative">
        <Image source={{ uri: offer.imageUrl }} className="w-full h-48" resizeMode="cover" />
        <ThemedView
          className="absolute top-3 right-3 flex-row items-center rounded-full px-3 py-1.5"
          style={{ backgroundColor: statusInfo.color }}
        >
          <Ionicons name={statusInfo.icon} size={14} color={colors.white} />
          <ThemedText className="text-xs font-bold ml-1.5" style={{ color: colors.white }}>
            {statusInfo.text}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView className="p-4 flex-1">
        {/* Blocco Indirizzo: Spaziatura inferiore rivista per coerenza */}
        <ThemedView className="flex-row items-center mb-3 gap-2">
          <Ionicons name="location-outline" size={22} color={colors.text} />
          <ThemedText className="text-lg font-bold flex-1" style={{ color: colors.text }}>
            {offer.address}
          </ThemedText>
        </ThemedView>

        {/* Principio di Vicinanza: Importo e Data raggruppati sulla stessa riga */}
        <ThemedView className="flex-row justify-between items-center mb-4">
          {/* Gruppo Importo */}
          <ThemedView className="flex-row items-center gap-1.5">
            <Ionicons name="cash-outline" size={20} color={colors.propertyCardDetail} />
            <ThemedText className="text-base" style={{ color: colors.propertyCardDetail }}>
              {offer.amount}
            </ThemedText>
          </ThemedView>
          {/* Gruppo Data */}
          <ThemedView className="flex-row items-center gap-1.5">
            <Ionicons name="calendar-outline" size={20} color={colors.propertyCardDetail} />
            <ThemedText className="text-base" style={{ color: colors.propertyCardDetail }}>
              {offer.date}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Principio di Continuità: Spaziatura verticale bilanciata */}
        <ThemedText className="text-base text-gray-600 dark:text-gray-300 mb-5 opacity-80">
          {offer.actionDescription}
        </ThemedText>

        {/* Azione: mt-auto spinge il bottone in fondo, creando una chiara separazione */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center mt-auto px-4 py-3 rounded-xl shadow-lg gap-2"
          style={{ backgroundColor: colors.buttonBackground }}
        >
          <ThemedText className="text-base font-bold" style={{ color: colors.buttonTextColor }}>
            {offer.actionText}
          </ThemedText>
          <Ionicons name={offer.actionIcon} size={22} color={colors.buttonTextColor} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default OfferCard;