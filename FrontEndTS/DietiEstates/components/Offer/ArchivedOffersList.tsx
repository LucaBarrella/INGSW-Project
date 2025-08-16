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
  // In a real scenario, this would use React Query to fetch data
  // For now, returning mock data or an empty array
  const mockOffers: Array<ArchivedOfferCardProps['offer']> = [
    {
      id: '1',
      status: 'accepted',
      propertyImage: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Accepted+Offer+1',
      propertyName: 'Villa al Mare',
      propertyAddress: 'Via Roma 1, Napoli',
      offerAmount: 350000,
      buyerName: 'Mario Rossi',
      buyerId: 'buyer123',
    },
    {
      id: '2',
      status: 'rejected',
      propertyImage: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Rejected+Offer+2',
      propertyName: 'Appartamento in Centro',
      propertyAddress: 'Corso Umberto I, Roma',
      offerAmount: 200000,
      buyerName: 'Luigi Verdi',
      buyerId: 'buyer456',
      rejectionReason: 'Offerta troppo bassa',
      offeror: 'Agente Immobiliare',
      proposal: '220.000€',
    },
    {
      id: '3',
      status: 'accepted',
      propertyImage: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Accepted+Offer+3',
      propertyName: 'Attico Panoramico',
      propertyAddress: 'Via Dante 10, Milano',
      offerAmount: 600000,
      buyerName: 'Anna Neri',
      buyerId: 'buyer789',
    },
  ];

  const data = mockOffers.filter(offer => offer.status === status);
  const isLoading = false; // Simulate loading state
  const isError = false; // Simulate error state

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