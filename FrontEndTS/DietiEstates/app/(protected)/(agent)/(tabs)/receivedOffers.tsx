import React, { useCallback, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, PropertyWithOffers } from '@/src/dto/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';
import { useOffers } from '@/src/hooks/useOffers';
import { formatAddress } from '@/components/Agent/PropertyDashboard/types';
import { useFocusEffect } from 'expo-router';

export default function OffersTab() {
  const backgroundColor = useThemeColor({}, 'background');
  
  const loading = false;
  const propertiesWithOffers: PropertyWithOffers[] = [];
  const {receivedOffers, fetchReceivedOffers} = useOffers();

  useEffect(() => {
    if (!receivedOffers) return;
    console.log(JSON.stringify(receivedOffers));
    receivedOffers.forEach(offer => {
      const propertyIndex = propertiesWithOffers.findIndex(p => p.id === offer.property.id.toString());
      let mappedOffer : Offer = {
        ...offer,
        id: offer.id.toString(),
        amount: offer.price,
        buyer: {
          id: offer.user.id?.toString() || '',
          name: offer.user.fullName,
        }
      };
      if (propertyIndex !== -1) {
        propertiesWithOffers[propertyIndex].offers.push(mappedOffer);
      } else {
        propertiesWithOffers.push({
          id: offer.property.id.toString(),
          address: formatAddress(offer.property.address),
          imageUrl: offer.property.firstImageUrl || (offer.property.imageUrl ? offer.property.imageUrl[0] : ''),
          offers: [mappedOffer],
        });
      }
    });
  }, [receivedOffers]);

  const handleRefresh = async () => {
    console.log("Refresh disabled");
  };

  const handleAcceptOffer = async (offerId: string) => {
    console.log("Accept offer disabled");
  };

  const handleRejectOffer = async (offerId: string) => {
    console.log("Reject offer disabled");
  };

  const handleAcceptHighestRejectOthers = async (propertyId: string) => {
    console.log("Accept highest offer disabled");
  };

  useFocusEffect(
    useCallback(() => {
      fetchReceivedOffers();
    }, [])
  );

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