import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyWithOffers, OfferStatus } from '@/types/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';

// Mock data per il testing - verrà sostituito con i dati reali dal backend
const mockProperties: PropertyWithOffers[] = [
  {
    id: '1',
    address: 'Via Roma 123, Napoli, Italia',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ffcd1fd484cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM5MzF8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3MDY3OTQ1ODd8MA&ixlib=rb-4.0.3&q=80&w=400',
    offers: [
      {
        id: 'offer1',
        amount: 250000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer1',
          name: 'Mario Rossi'
        },
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'offer2',
        amount: 240000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer2',
          name: 'Laura Bianchi'
        },
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        id: 'offer3',
        amount: 260000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer3',
          name: 'Giuseppe Verdi'
        },
        createdAt: '2024-01-16T09:15:00Z'
      }
    ]
  },
  {
    id: '2',
    address: 'Via delle Paste 45, Roma, Italia',
    imageUrl: 'https://images.unsplash.com/photo-1570129476811-abf0e7787f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM5MzF8MHwxfHNlYXJjaHwxfHxob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8MTcwNjc5NDYxNHww&ixlib=rb-4.0.3&q=80&w=400',
    offers: [
      {
        id: 'offer4',
        amount: 180000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer4',
          name: 'Sofia Gallo'
        },
        createdAt: '2024-01-13T16:45:00Z'
      }
    ]
  },
  {
    id: '3',
    address: 'Piazza Duomo 1, Milano, Italia',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-52c5df75d543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM5MzF8MHwxfHNlYXJjaHwxfHxjb25kb21pbml1bSUyMGV4dGVyaW9yfGVufDB8fHx8MTcwNjc5NDY0MXww&ixlib=rb-4.0.3&q=80&w=400',
    offers: [
      {
        id: 'offer5',
        amount: 320000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer5',
          name: 'Marco Ferrari'
        },
        createdAt: '2024-01-17T11:30:00Z'
      },
      {
        id: 'offer6',
        amount: 315000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer6',
          name: 'Anna Russo'
        },
        createdAt: '2024-01-16T15:20:00Z'
      },
      {
        id: 'offer7',
        amount: 330000,
        status: OfferStatus.Active,
        buyer: {
          id: 'buyer7',
          name: 'Paolo Leone'
        },
        createdAt: '2024-01-18T08:45:00Z'
      },
      {
        id: 'offer8',
        amount: 310000,
        status: OfferStatus.Rejected,
        buyer: {
          id: 'buyer8',
          name: 'Chiara Romano'
        },
        createdAt: '2024-01-12T13:10:00Z'
      }
    ]
  }
];

export default function OffersTab() {
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<PropertyWithOffers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Simula il caricamento dati
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simula un ritardo di rete
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProperties(mockProperties);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const refetch = async () => {
    setRefreshing(true);
    // Simula un refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProperties(mockProperties);
    setRefreshing(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAcceptOffer = (offerId: string) => {
    console.log('Accept offer:', offerId);
    // Qui verrà implementata la logica per accettare l'offerta
    // tramite il custom hook useUpdateOfferStatus
  };

  const handleRejectOffer = (offerId: string) => {
    console.log('Reject offer:', offerId);
    // Qui verrà implementata la logica per rifiutare l'offerta
    // tramite il custom hook useUpdateOfferStatus
  };

  const handleAcceptHighestRejectOthers = (propertyId: string) => {
    console.log('Accept highest and reject others for property:', propertyId);
    // Qui verrà implementata la logica per accettare l'offerta più alta
    // e rifiutare tutte le altre per un immobile specifico
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <OffersDashboardScreen
        properties={properties}
        loading={isLoading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onAcceptOffer={handleAcceptOffer}
        onRejectOffer={handleRejectOffer}
        onAcceptHighestRejectOthers={handleAcceptHighestRejectOthers}
      />
    </ThemedView>
  );
}