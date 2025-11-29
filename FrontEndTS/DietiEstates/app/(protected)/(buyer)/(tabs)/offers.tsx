import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import OfferCard from '@/components/Offer/OfferCard';
import { useTranslation } from 'react-i18next';
import { useOffers } from '@/src/hooks/useOffers';
import { useFocusEffect } from 'expo-router';

const OffersScreen: React.FC = () => {
  const background = useThemeColor({}, 'background');
  const headerText = useThemeColor({}, 'text');
  const { t } = useTranslation();

  const {offers, loading, error, fetchOffers} = useOffers();

  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, [])
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
        <ThemedText className="text-lg" style={{ color: headerText }}>{t('loading_offers')}...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 justify-center items-center" style={{ backgroundColor: background }}>
        <ThemedText className="text-lg text-red-500">{t('error_loading_offers')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: background }}>
        <ThemedView className="flex-row items-center p-4 pb-2 justify-center">
          <ThemedText className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center" style={{ color: headerText }}>{t('offers')}</ThemedText>
        </ThemedView>
        <FlatList
          data={offers}
          renderItem={({ item }) => <OfferCard offer={item} />}
          keyExtractor={(item) => item.id.toString()}
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