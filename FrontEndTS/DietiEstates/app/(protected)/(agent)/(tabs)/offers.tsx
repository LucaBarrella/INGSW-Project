import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useOffersViewModel } from '@/src/presentation/hooks/useOffersViewModel';
import { PropertyWithOffers } from '@/types/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';

export default function OffersTab() {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  
  const {
    loading,
    error,
    offers,
    fetchOffers,
    updateOfferStatus
  } = useOffersViewModel();

  // Converti gli offers nel formato PropertyWithOffers
  // Questo è un mapping temporaneo, dovrebbe essere gestito dal ViewModel
  const propertiesWithOffers: PropertyWithOffers[] = offers.reduce((acc: PropertyWithOffers[], offer) => {
    const existingProperty = acc.find(p => p.id === offer.propertyId);
    if (existingProperty) {
      existingProperty.offers.push({
        id: offer.id,
        amount: offer.amount,
        status: offer.status as any, // Conversione temporanea
        buyer: {
          id: offer.buyerId,
          name: 'Nome acquirente' // Dovrebbe essere recuperato da un UserRepository
        },
        createdAt: offer.createdAt.toISOString()
      });
    } else {
      acc.push({
        id: offer.propertyId,
        address: 'Indirimento temporaneo', // Dovrebbe essere recuperato da un PropertyRepository
        imageUrl: 'https://via.placeholder.com/400',
        offers: [{
          id: offer.id,
          amount: offer.amount,
          status: offer.status as any, // Conversione temporanea
          buyer: {
            id: offer.buyerId,
            name: 'Nome acquirente' // Dovrebbe essere recuperato da un UserRepository
          },
          createdAt: offer.createdAt.toISOString()
        }]
      });
    }
    return acc;
  }, []);

  const handleRefresh = async () => {
    await fetchOffers();
  };

  const handleAcceptOffer = async (offerId: string) => {
    await updateOfferStatus(offerId, 'accepted');
  };

  const handleRejectOffer = async (offerId: string) => {
    await updateOfferStatus(offerId, 'rejected');
  };

  const handleAcceptHighestRejectOthers = async (propertyId: string) => {
    // Trova tutte le offerte per questa proprietà
    const propertyOffers = offers.filter(offer => offer.propertyId === propertyId);
    
    if (propertyOffers.length === 0) return;
    
    // Trova l'offerta più alta
    const highestOffer = propertyOffers.reduce((highest, current) =>
      current.amount > highest.amount ? current : highest
    );
    
    // Accetta l'offerta più alta
    await updateOfferStatus(highestOffer.id, 'accepted');
    
    // Rifiuta tutte le altre offerte
    const otherOffers = propertyOffers.filter(offer => offer.id !== highestOffer.id);
    for (const offer of otherOffers) {
      await updateOfferStatus(offer.id, 'rejected');
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: backgroundColor }}>
      <OffersDashboardScreen
        properties={propertiesWithOffers}
        loading={loading}
        refreshing={false}
        onRefresh={handleRefresh}
        onAcceptOffer={handleAcceptOffer}
        onRejectOffer={handleRejectOffer}
        onAcceptHighestRejectOthers={handleAcceptHighestRejectOthers}
      />
    </ThemedView>
  );
}