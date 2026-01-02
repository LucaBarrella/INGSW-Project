import React from 'react';
import { FlatList, ActivityIndicator, StyleSheet, Linking, View } from 'react-native';
import { ArchivedOfferCard } from './ArchivedOfferCard';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useOffers } from '@/src/hooks/useOffers';
import { t } from 'i18next';

interface ArchivedOffersListProps {
  filter: 'accepted' | 'rejected';
}

// Placeholder for the actual React Query hook
// This hook should fetch archived offers based on the provided status filter
function useGetArchivedOffers(status: 'accepted' | 'rejected') {
  const {loading, receivedOffers, fetchReceivedOffers, error} = useOffers();

  React.useEffect(() => {
    fetchReceivedOffers();
  }, [status]);

  const filteredOffers = Array.isArray(receivedOffers)
    ? receivedOffers.filter(offer => offer.status.toLowerCase() === status)
    : [];

  return { receivedOffers: filteredOffers, loading, error };
}

const handleContactBuyer = (email: string) => {
  Linking.openURL(`mailto:${email}`);
}

export function ArchivedOffersList({ filter }: ArchivedOffersListProps) {
  const { receivedOffers: offers, loading, error } = useGetArchivedOffers(filter);
  const textColor = useThemeColor({}, 'text');

  if (loading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color={textColor} />;
  }

  if (error) {
    return <ThemedText style={[styles.errorText, { color: textColor }]}>{t('errorLoadingOffers')}</ThemedText>;
  }

  if (!offers || offers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons
            name={filter === 'accepted' ? "checkmark-done-circle-outline" : "close-circle-outline"}
            size={64}
            color={textColor}
            style={{ opacity: 0.2 }}
          />
        </View>
        <ThemedText style={[styles.noOffersText, { color: textColor }]}>
          {t('noOffersFound', { status: t(`offer_status.${filter.toUpperCase()}`) })}
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ArchivedOfferCard offer={item} onContactBuyer={handleContactBuyer} />}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  noOffersText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
    paddingHorizontal: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});