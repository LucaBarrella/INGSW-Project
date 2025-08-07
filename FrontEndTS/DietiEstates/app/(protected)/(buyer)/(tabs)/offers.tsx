import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, mockOffers } from '@/app/_services/__mocks__/offersMockData';
import OfferCard from '@/components/Offer/OfferCard';


const OffersScreen: React.FC = () => {
  const headerBg = useThemeColor({}, 'background');
  const headerText = useThemeColor({}, 'text');

  const offers = mockOffers;

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: headerBg }}>
        <ThemedView className="flex-row items-center p-4 pb-2 justify-center" style={{ backgroundColor: headerBg }}>
          <ThemedText className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ color: headerText }}>Offerte</ThemedText>
        </ThemedView>
        <ScrollView className="flex-1 p-4">
          {offers.map((offer) => (
            <ThemedView key={offer.id} className="mb-4 bg-white rounded-2xl shadow-lg p-4">
              <OfferCard offer={offer} />
            </ThemedView>
          ))}
        </ScrollView>
    </ThemedView>
  );
};

export default OffersScreen;