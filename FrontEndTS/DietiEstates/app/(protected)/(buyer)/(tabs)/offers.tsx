import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, mockOffers } from '@/app/_services/__mocks__/offersMockData';
import OfferCard from '@/components/Offer/OfferCard';


const OffersScreen: React.FC = () => {
  const backgroundMuted = useThemeColor({}, 'backgroundMuted');
  const headerText = useThemeColor({}, 'text');

  const offers = mockOffers;

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: backgroundMuted }}>
        <ThemedView className="flex-row items-center p-4 pb-2 justify-center">
          <ThemedText className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ color: headerText }}>Offerte</ThemedText>
        </ThemedView>
        <ScrollView className="flex-1 p-4" style={{ backgroundColor: backgroundMuted }}>
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </ScrollView>
    </ThemedView>
  );
};

export default OffersScreen;