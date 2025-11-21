import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyWithOffers } from '@/src/dto/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';

export default function OffersTab() {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  
  const loading = false;
  const propertiesWithOffers: PropertyWithOffers[] = [];

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