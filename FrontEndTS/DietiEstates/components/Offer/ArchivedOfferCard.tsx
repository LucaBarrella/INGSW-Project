import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export interface ArchivedOfferCardProps {
  offer: {
    id: string;
    status: 'accepted' | 'rejected';
    propertyImage: string;
    propertyName: string;
    propertyAddress: string;
    offerAmount: number;
    buyerName: string;
    buyerId: string;
    rejectionReason?: string;
    offeror?: string;
    proposal?: string;
  };
  onContactBuyer?: (buyerId: string) => void;
}

export function ArchivedOfferCard({ offer, onContactBuyer }: ArchivedOfferCardProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundMuted = useThemeColor({}, 'backgroundMuted');
  const border = useThemeColor({}, 'border');
  const success = useThemeColor({}, 'success');
  const error = useThemeColor({}, 'error');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');

  const isAccepted = offer.status === 'accepted';

  return (
    <ThemedView style={[styles.card, { borderColor: border, backgroundColor: backgroundMuted }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: offer.propertyImage }}
          style={[styles.propertyImage, !isAccepted && styles.grayscaleImage]}
        />
        <View style={[styles.statusBadge, { backgroundColor: isAccepted ? success : error }]}>
          <ThemedText style={styles.statusText}>
            {isAccepted ? 'OFFERTA ACCETTATA' : 'RIFIUTATA'}
          </ThemedText>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.propertyName}>{offer.propertyName}</ThemedText>
        <ThemedText style={[styles.propertyAddress, { color: textColor }]}>{offer.propertyAddress}</ThemedText>
        <ThemedText style={styles.offerAmount}>Offerta: €{offer.offerAmount.toLocaleString('it-IT')}</ThemedText>

        {isAccepted ? (
          <View style={styles.buyerInfo}>
            {/* UserIcon placeholder */}
            <ThemedText style={styles.buyerName}>Acquirente: {offer.buyerName}</ThemedText>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: buttonBackground }]}
              onPress={() => onContactBuyer && onContactBuyer(offer.buyerId)}
            >
              <Text style={[styles.contactButtonText, { color: buttonTextColor }]}>Contatta Acquirente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.rejectionLog}>
            <ThemedText style={styles.logTitle}>Log Rifiuto:</ThemedText>
            {offer.offeror && <ThemedText style={styles.logText}>Offerente: {offer.offeror}</ThemedText>}
            {offer.proposal && <ThemedText style={styles.logText}>Proposta: {offer.proposal}</ThemedText>}
            {offer.rejectionReason && <ThemedText style={styles.logText}>Motivazione: {offer.rejectionReason}</ThemedText>}
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
    flexDirection: 'row',
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
  grayscaleImage: {
    // filter: 'grayscale(100%)', // This will not work directly in React Native, needs a color matrix filter
    // For grayscale, consider using a ColorMatrixImageFilters library or a custom shader if needed.
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 8,
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