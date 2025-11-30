import React, { useCallback, useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Offer, PropertyWithOffers } from '@/src/dto/offers';
import OffersDashboardScreen from '@/components/Offer/OffersDashboardScreen';
import { useOffers } from '@/src/hooks/useOffers';
import { formatAddress } from '@/components/Agent/PropertyDashboard/types';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { t } from 'i18next';
import { Alert, Platform, Modal, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import OfferPanel from '@/components/Offer/OfferPanel';

export default function OffersTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [counterOfferPrice, setCounterOfferPrice] = useState('');
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null);

  const [propertiesWithOffers, setPropertiesWithOffers] = useState<PropertyWithOffers[]>([]);
  const {receivedOffers, fetchReceivedOffers, loading, acceptOffer, rejectOffer, counterOffer} = useOffers();
  const [offerPanelProps, setOfferPanelProps] = useState<{isVisible: boolean; propertyId: string; propertyAddress: string; askingPrice: string}>({isVisible: false, propertyId: '', propertyAddress: '', askingPrice: ''});

  useEffect(() => {
    if (!receivedOffers) return;
    const newPropertiesWithOffers: PropertyWithOffers[] = [];
    receivedOffers.forEach(offer => {
      const propertyIndex = newPropertiesWithOffers.findIndex(p => p.id === offer.property.id.toString());
      let mappedOffer : Offer = {
        ...offer,
        id: offer.id.toString(),
        amount: offer.price,
        buyer: {
          id: offer.user?.id?.toString() || '',
          name: offer.user?.fullName || '',
        }
      };
      if (propertyIndex !== -1) {
        newPropertiesWithOffers[propertyIndex].offers.push(mappedOffer);
      } else {
        newPropertiesWithOffers.push({
          id: offer.property.id.toString(),
          address: formatAddress(offer.property.address),
          imageUrl: offer.property.firstImageUrl || (offer.property.imageUrl ? offer.property.imageUrl[0] : ''),
          offers: [mappedOffer],
          price: offer.property.price
        });
      }
    });
    setPropertiesWithOffers(newPropertiesWithOffers);
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

  const submitCounterOffer = async (price: string) => {
    const priceNumber = parseFloat(price);
    
    if (!price || price.trim() === '') {
      Alert.alert(t('error'), t('pleaseEnterPrice'));
      return;
    }
    
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert(t('error'), t('pleaseEnterValidPrice'));
      return;
    }

    if (currentOfferId) {
      const response = await counterOffer(currentOfferId, priceNumber);
      if (response.success !== false) {
        Alert.alert(t('counterOfferSubmitted'), t('yourCounterOfferHasBeenSubmittedSuccessfully'));
        setShowCounterOfferModal(false);
        setCounterOfferPrice('');
        setCurrentOfferId(null);
      } else {
        Alert.alert(t('error'), t('failedToSubmitCounterOffer'));
      }
    }
  };

  const handleCounterOffer = async (offerId: string) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        t('counterOffer'),
        t('enterCounterOfferPrice'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('submit'),
            onPress: (price) => {
              if (price) {
                submitCounterOffer(price);
              }
            },
          },
        ],
        'plain-text',
        '',
        'numeric'
      );
    } else {
      setCurrentOfferId(offerId);
      setCounterOfferPrice('');
      setShowCounterOfferModal(true);
    }
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

  const handleInsertExternalOffer = async (propertyId: string, propertyAddress: string, askingPrice: string) => {
    setOfferPanelProps({isVisible: true, propertyId, propertyAddress, askingPrice});
  };

  const handleOfferPanelClose = () => {
    setOfferPanelProps({isVisible: false, propertyId: '', propertyAddress: '', askingPrice: ''});
  }

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
        onCounterOffer={handleCounterOffer}
        onAcceptHighestRejectOthers={handleAcceptHighestRejectOthers}
        onInsertExternalOffer={handleInsertExternalOffer}
      />

      <Modal
        visible={showCounterOfferModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCounterOfferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
            <ThemedText style={styles.modalTitle}>{t('counterOffer')}</ThemedText>
            <ThemedText style={styles.modalSubtitle}>{t('enterCounterOfferPrice')}</ThemedText>
            
            <TextInput
              style={styles.input}
              value={counterOfferPrice}
              onChangeText={setCounterOfferPrice}
              placeholder={t('enterPrice')}
              keyboardType="numeric"
              autoFocus={true}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowCounterOfferModal(false);
                  setCounterOfferPrice('');
                  setCurrentOfferId(null);
                }}
              >
                <ThemedText style={styles.buttonText}>{t('cancel')}</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={() => submitCounterOffer(counterOfferPrice)}
              >
                <ThemedText style={[styles.buttonText, styles.submitButtonText]}>{t('submit')}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <OfferPanel {...offerPanelProps} onClose={handleOfferPanelClose} external/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
  },
});