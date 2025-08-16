import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyWithOffers, Offer, OfferStatus } from '@/types/offers';
import SingleOfferItem from './SingleOfferItem';

interface PropertyOffersCardProps {
  property: PropertyWithOffers;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onAcceptHighestRejectOthers: (propertyId: string) => void;
}

const PropertyOffersCard: React.FC<PropertyOffersCardProps> = ({
  property,
  onAcceptOffer,
  onRejectOffer,
  onAcceptHighestRejectOthers,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const brandColor = useThemeColor({}, 'tint');
  const secondaryColor = useThemeColor({}, 'propertyCardDetail');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filtra solo le offerte attive
  const activeOffers = property.offers.filter(offer => offer.status === OfferStatus.Active);
  
  // Trova l'offerta più alta tra quelle attive
  const highestOffer = activeOffers.length > 0 
    ? activeOffers.reduce((highest, current) => 
        current.amount > highest.amount ? current : highest
      )
    : null;

  // Conta le nuove offerte (offerte create negli ultimi 7 giorni)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newOffersCount = activeOffers.filter(offer => 
    new Date(offer.createdAt) > sevenDaysAgo
  ).length;

  // Ordina le offerte per importo dal più alto al più basso
  const sortedOffers = [...activeOffers].sort((a, b) => b.amount - a.amount);

  return (
    <ThemedView
      className="mb-4 rounded-xl border overflow-hidden"
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
    >
      {/* Header della card con immagine e informazioni */}
      <View className="flex-row">
        {/* Immagine proprietà */}
        <View className="w-24 h-24">
          <Image
            source={{ uri: property.imageUrl }}
            className="w-full h-full rounded-l-xl"
            resizeMode="cover"
          />
        </View>

        {/* Informazioni proprietà */}
        <View className="flex-1 p-4">
          <ThemedText className="font-bold text-base mb-1" style={{ color: textColor }}>
            {property.address}
          </ThemedText>
          
          <View className="flex-row items-center mb-2">
            <Ionicons name="document-text-outline" size={14} color={secondaryColor} />
            <ThemedText className="ml-1 text-sm" style={{ color: secondaryColor }}>
              {activeOffers.length} Offerte{activeOffers.length !== 1 ? '' : 'a'}
            </ThemedText>
          </View>

          {highestOffer && (
            <View className="flex-row items-center">
              <Ionicons name="trending-up-outline" size={14} color={brandColor} />
              <ThemedText className="ml-1 text-sm font-semibold" style={{ color: brandColor }}>
                Offerta più alta: {formatCurrency(highestOffer.amount)}
              </ThemedText>
            </View>
          )}

          {newOffersCount > 0 && (
            <View className="flex-row items-center mt-2">
              <View className="bg-red-500 px-2 py-1 rounded-full">
                <ThemedText className="text-xs font-bold" style={{ color: 'white' }}>
                  {newOffersCount} Nuov{newOffersCount === 1 ? 'a' : 'e'}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Pulsante espandi/contrai */}
        <TouchableOpacity
          className="p-4"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      </View>

      {/* Sezione espandibile con le offerte */}
      {isExpanded && activeOffers.length > 0 && (
        <View className="px-4 pb-4">
          {/* Pulsante accetta più alta e rifiuta altre */}
          <TouchableOpacity
            className="w-full h-10 rounded-lg mb-4 flex items-center justify-center"
            style={{
              backgroundColor: brandColor,
            }}
            onPress={() => onAcceptHighestRejectOthers(property.id)}
          >
            <ThemedText className="text-sm font-medium" style={{ color: 'white' }}>
              Accetta Offerta più Alta & Rifiuta Altre
            </ThemedText>
          </TouchableOpacity>

          {/* Lista offerte ordinate */}
          {sortedOffers.map((offer, index) => (
            <SingleOfferItem
              key={offer.id}
              offer={offer}
              onAccept={onAcceptOffer}
              onReject={onRejectOffer}
            />
          ))}
        </View>
      )}

      {/* Messaggio quando non ci sono offerte attive */}
      {isExpanded && activeOffers.length === 0 && (
        <View className="px-4 pb-4">
          <ThemedText className="text-center text-sm" style={{ color: secondaryColor }}>
            Non ci sono offerte attive per questa proprietà.
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

export default PropertyOffersCard;