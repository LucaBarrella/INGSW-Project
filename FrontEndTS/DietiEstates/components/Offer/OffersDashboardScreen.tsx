import React from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PropertyWithOffers } from '@/src/dto/offers';
import PropertyOffersCard from './PropertyOffersCard';
import { t } from 'i18next';

interface OffersDashboardScreenProps {
  // Queste props verranno sostituite dai custom hook di React Query
  // quando la logica di backend sarà implementata
  properties: PropertyWithOffers[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onAcceptHighestRejectOthers: (propertyId: string) => void;
}

const OffersDashboardScreen: React.FC<OffersDashboardScreenProps> = ({
  properties,
  loading,
  refreshing,
  onRefresh,
  onAcceptOffer,
  onRejectOffer,
  onAcceptHighestRejectOthers,
}) => {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'propertyCardDetail');

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <ThemedText className="text-lg font-semibold mb-2" style={{ color: textColor }}>
        {t('noActiveOffers')}
      </ThemedText>
      <ThemedText className="text-center text-sm" style={{ color: secondaryColor }}>
        {t('noActiveOffersSubtitle')}
      </ThemedText>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color={textColor} />
      <ThemedText className="mt-4 text-sm" style={{ color: secondaryColor }}>
        {t('loadingOffers')}
      </ThemedText>
    </View>
  );

  const renderPropertyCard = ({ item }: { item: PropertyWithOffers }) => (
    <PropertyOffersCard
      property={item}
      onAcceptOffer={onAcceptOffer}
      onRejectOffer={onRejectOffer}
      onAcceptHighestRejectOthers={onAcceptHighestRejectOthers}
    />
  );

  if (loading && properties.length === 0) {
    return renderLoadingState();
  }

  return (
    <ThemedView className="flex-1" style={{ backgroundColor: backgroundColor }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-4 border-b"
        style={{
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <View>
          <ThemedText className="text-2xl font-bold" style={{ color: textColor }}>
            {t('offersDashboardTitle')}
          </ThemedText>
          <ThemedText className="text-sm mt-1" style={{ color: secondaryColor }}>
            {t('offersDashboardSubtitle')}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(protected)/(agent)/archive')}
          className="p-2"
        >
          <Ionicons name="archive-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Lista proprietà con offerte */}
      <FlatList
        data={properties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={textColor}
          />
        }
      />
    </ThemedView>
  );
};

export default OffersDashboardScreen;