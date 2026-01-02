import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OfferResponseDTO } from '@/src/dto/response/OfferResponseDTO';
import { t } from 'i18next';
import { formatPrice, getPropertyImage, safeGetAddress } from '@/src/utils/uiHelpers';

export interface ArchivedOfferCardProps {
  offer: OfferResponseDTO;
  onContactBuyer: (email: string) => void;
}

export function ArchivedOfferCard({ offer, onContactBuyer }: ArchivedOfferCardProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundMuted = useThemeColor({}, 'backgroundMuted');
  const border = useThemeColor({}, 'border');
  const success = useThemeColor({}, 'success');
  const error = useThemeColor({}, 'error');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');

  const isAccepted = offer.status === 'ACCEPTED';

  return (
    <ThemedView style={[styles.card, { borderColor: border, backgroundColor: backgroundMuted }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getPropertyImage(offer.property) }}
          style={[styles.propertyImage]}
        />
        <View style={[styles.statusBadge, { backgroundColor: isAccepted ? success : error }]}>
          <ThemedText style={styles.statusText}>
            {isAccepted ? t('offer_status.ACCEPTED') : t('offer_status.REJECTED')}
          </ThemedText>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.propertyName}>{t(`property_category.sub.${offer.property.propertyCategory}`)}</ThemedText>
        <ThemedText style={[styles.propertyAddress, { color: textColor }]}>{safeGetAddress(offer.property.address).display}</ThemedText>
        <ThemedText style={styles.offerAmount}>{t('offersArchived.agent.offerAmount', { amount: formatPrice(offer.price) })}</ThemedText>

        {offer.user && (isAccepted ? (
          <View style={styles.buyerInfo}>
            {/* UserIcon placeholder */}
            <ThemedText style={styles.buyerName}>{t('offersArchived.agent.buyerLabel', { name: offer.user.fullName })}</ThemedText>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: buttonBackground }]}
              onPress={() => onContactBuyer && onContactBuyer(offer.user?.email ?? '')}
            >
              <Text style={[styles.contactButtonText, { color: buttonTextColor }]}>{t('offersArchived.agent.contactBuyer')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.rejectionLog}>
            <ThemedText style={styles.logTitle}>{t('offersArchived.agent.rejectionLogTitle')}</ThemedText>
            <ThemedText style={styles.logText}>{t('offersArchived.agent.offererLabel', { name: offer.user.fullName })}</ThemedText>
            <ThemedText style={styles.logText}>{t('offersArchived.agent.proposalAmount', { amount: formatPrice(offer.price) })}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  imageContainer: {
    width: '40%',
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    color: 'white', // Assuming white text on colored badge
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsContainer: {
    width: '60%',
    padding: 12,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  offerAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buyerInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  buyerName: {
    fontSize: 14,
    marginBottom: 8,
  },
  contactButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontWeight: 'bold',
  },
  rejectionLog: {
    marginTop: 8,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logText: {
    fontSize: 12,
    marginBottom: 2,
  },
});