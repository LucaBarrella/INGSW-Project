import React, { useCallback, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, PropertyWithOffers } from '@/src/dto/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';
import { useOffers } from '@/src/hooks/useOffers';
import { formatAddress } from '@/components/Agent/PropertyDashboard/types';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { t } from 'i18next';
import { Alert } from 'react-native';

export default function OffersTab() {
  const backgroundColor = useThemeColor({}, 'background');

  const propertiesWithOffers: PropertyWithOffers[] = [];
  const {receivedOffers, fetchReceivedOffers, loading, acceptOffer, rejectOffer} = useOffers();

  useEffect(() => {
    if (!receivedOffers) return;
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
      fetchReceivedOffers();
  };

  const handleAcceptOffer = async (offerId: string) => {
    await acceptOffer(offerId);
  };

  const handleRejectOffer = async (offerId: string) => {
    await rejectOffer(offerId);
  };

  const handleAcceptHighestRejectOthers = async (propertyId: string) => {
    const properties = propertiesWithOffers.filter(p => p.id === propertyId);
    if (properties.length === 0) return;
    const property = properties[0];
    const activeOffers = property.offers.filter(offer => offer.status === 'PENDING');
    if (activeOffers.length === 0) return;
    const highestOffer = activeOffers.reduce((highest, current) => 
      current.amount > highest.amount ? current : highest
    );

    Alert.alert(
      t('confirmAcceptHighestOfferTitle'),
      t('confirmAcceptHighestOfferMessage', { amount: highestOffer.amount }),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('confirm'),
          onPress: async () => {
            await acceptOffer(highestOffer.id);
            for (const offer of activeOffers) {
              if (offer.id !== highestOffer.id) {
                await rejectOffer(offer.id);
              }
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchReceivedOffers();
    }, [])
  );
  
  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor }}>
        <ThemedText>{t('loadingOffers')}</ThemedText>
      </ThemedView>
    );
  }

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