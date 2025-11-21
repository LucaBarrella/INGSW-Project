import React from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ArchivedOfferCard, ArchivedOfferCardProps } from './ArchivedOfferCard';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ArchivedOffersListProps {
  filter: 'accepted' | 'rejected';
}

// Placeholder for the actual React Query hook
// This hook should fetch archived offers based on the provided status filter
function useGetArchivedOffers(status: 'accepted' | 'rejected') {
  // TODO: Replace with actual API call using React Query
  // const { data, isLoading, isError } = useQuery(['archived-offers', status], () =>
  //   fetchArchivedOffers(status)
  // );

  // For now, return empty data
  const data: Array<ArchivedOfferCardProps['offer']> = [];
  const isLoading = false;
  const isError = false;

  return { data, isLoading, isError };
}

export function ArchivedOffersList({ filter }: ArchivedOffersListProps) {
  const { data: offers, isLoading, isError } = useGetArchivedOffers(filter);
  const textColor = useThemeColor({}, 'text');

  if (isLoading) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color={textColor} />;
  }

  if (isError) {
    return <ThemedText style={[styles.errorText, { color: textColor }]}>Errore nel caricamento delle offerte.</ThemedText>;
  }

  if (!offers || offers.length === 0) {
    return <ThemedText style={[styles.noOffersText, { color: textColor }]}>Nessuna offerta {filter === 'accepted' ? 'accettata' : 'rifiutata'} trovata.</ThemedText>;
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArchivedOfferCard offer={item} />}
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
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});