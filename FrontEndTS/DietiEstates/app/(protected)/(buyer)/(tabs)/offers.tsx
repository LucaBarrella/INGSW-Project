import React from 'react';
import { FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer } from '@/components/Offer/OfferCard';
import OfferCard from '@/components/Offer/OfferCard';
import { useTranslation } from 'react-i18next';

// TODO: Replace with actual React Query hook
// const { data: offers, isLoading, error } = useQuery(['offers'], fetchOffers);

const OffersScreen: React.FC = () => {
  const background = useThemeColor({}, 'background');
  const headerText = useThemeColor({}, 'text');
  const { t } = useTranslation();

  // For now, using empty array until real API integration
  const offers: Offer[] = [];

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: background }}>
        <ThemedView className="flex-row items-center p-4 pb-2 justify-center">
          <ThemedText className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ color: headerText }}>{t('offers')}</ThemedText>
        </ThemedView>
        <FlatList
          data={offers}
          renderItem={({ item }) => <OfferCard offer={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, backgroundColor: background }}
          ListEmptyComponent={
            <ThemedText className="text-center text-gray-500 mt-8" style={{ color: headerText }}>
              {t('no_offers_available')}
            </ThemedText>
          }
        />
    </ThemedView>
  );
};

export default OffersScreen;