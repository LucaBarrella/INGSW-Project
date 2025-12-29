import React from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { OfferResponseDTO } from '@/src/dto/response/OfferResponseDTO';
import { t } from 'i18next';
import { useOffers } from '@/src/hooks/useOffers';
import { formatPrice, getPropertyImage, safeGetAddress } from '@/src/utils/uiHelpers';

export interface Offer {
  id: string;
  address: string;
  amount: string;
  date: string;
  // use API canonical status values; translation is handled via t('offer_status.X')
  status: OfferResponseDTO['status'];
  imageUrl: string;
  actionText: string;
  actionIcon: IconName;
  actionDescription: string;
}

interface OfferCardProps {
  offer: OfferResponseDTO;
  onUpdate: () => void;
}

const StatusBadge = ({ status, color, icon }: {
  status: string;
  color: string;
  icon: IconName
}) => {
  const normalizedColor = color.startsWith('#') ? color : '#000000';
  
  return (
    <ThemedView
      className="absolute top-3 right-3 flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: normalizedColor.length === 7 ? `${normalizedColor}99` : normalizedColor,
        borderColor: normalizedColor.length === 7 ? `${normalizedColor}40` : normalizedColor,
        borderWidth: 1,
      }}
    >
      <Ionicons name={icon} size={14} color={"#FFFFFF"} />
      <ThemedText className="font-bold" style={{ color: "#FFFFFF" }}>{status}</ThemedText>
    </ThemedView>
  );
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onUpdate }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // locale-aware formatting helpers (use runtime locale)
  const locale = Intl?.DateTimeFormat?.().resolvedOptions()?.locale || 'it-IT';
  const formatDate = (iso?: string) => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString(locale); } catch { return iso; }
  };

  const getStatusInfo = (status: OfferResponseDTO['status']): { color: string; icon: IconName; text: string } => {
    switch (status) {
      case 'ACCEPTED':
        return {
          color: colors.visitStatusAccepted,
          icon: 'checkmark-circle-outline',
          text: t('offer_status.ACCEPTED'),
        };
      case 'REJECTED':
        return {
          color: colors.visitStatusRejected,
          icon: 'close-circle-outline',
          text: t('offer_status.REJECTED'),
        };
      case 'PENDING':
        return {
          color: colors.visitStatusPending,
          icon: 'time-outline',
          text: t('offer_status.PENDING'),
        };
      case 'WITHDRAWN':
        return {
          color: colors.offerStatusWithdrawn,
          icon: 'remove-circle-outline',
          text: t('offer_status.WITHDRAWN'),
        };
      case 'COUNTERED':
        return {
          color: colors.offerStatusCountered,
          icon: 'swap-horizontal-outline',
          text: t('offer_status.COUNTERED'),
        };
      default:
        return {
          color: colors.text,
          icon: 'help-circle-outline',
          text: t('offer_status.UNKNOWN'),
        };
    }
  };

  const statusInfo = getStatusInfo(offer.status);
  const { withdrawOffer, acceptOffer } = useOffers();

  const handleWithdrawOffer = (offerId: string) => {
    Alert.alert(
      t('confirm_withdraw_offer'),
      '',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('withdraw'),
          onPress: async () => {
            try {
              const response = await withdrawOffer(offerId);
              if (response.success !== false) {
                Alert.alert(t('offerWithdrawn'), t('youHaveWithdrawnTheOfferSuccessfully'));
                onUpdate();
              }
            } catch (err) {
              Alert.alert(t('error'), t('failedToWithdrawOffer'));
            }
          },
        },
      ]
    );
  };

  const handleAcceptCounteredOffer = () => {
    Alert.alert(
      t('confirm_accept_countered_offer'),
      '',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('accept'),
          onPress: async () => {
            try {
              const response = await acceptOffer(offer.id.toString());
              if (response.success !== false) {
                Alert.alert(t('offerAccepted'), t('youHaveAcceptedTheCounteredOfferSuccessfully'));
                onUpdate();
              }
              else {
                Alert.alert(t('error'), t('failedToAcceptCounteredOffer'));
              }
            } catch (err) {
              Alert.alert(t('error'), t('failedToAcceptCounteredOffer'));
            }
          },
        },
      ]
    );
  }
  
  return (
    <ThemedView className="bg-background rounded-xl m-4 shadow-lg border-border" style={{ backgroundColor: 'transparent' }}>
      <ThemedView className="relative" style={{ backgroundColor: 'transparent' }}>
        <Image
          source={{ uri: getPropertyImage(offer.property) }}
          className="w-full h-52 rounded-t-xl"
          resizeMode="cover"
        />
        <StatusBadge 
          status={statusInfo.text} 
          color={statusInfo.color} 
          icon={statusInfo.icon} 
        />
      </ThemedView>
      
      <ThemedView className="p-5 space-y-4 bg-card rounded-b-xl gap-4" style={{ backgroundColor: colors.propertyCardBackground }}>
        {/* Address Section */}
        <View className="flex-row items-start gap-2">
          <Ionicons name="location-outline" size={20} color={colors.text} className="mt-0.5" />
          <ThemedText className="text-lg font-semibold flex-1">{safeGetAddress(offer.property.address).display}</ThemedText>
        </View>
        
        {/* Financial and Date Details */}
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="cash-outline" size={16} color={colors.text} />
          <ThemedText className="text-muted-foreground">{formatPrice(offer.price)}</ThemedText>
        </View>
        
        {/* Description */}
        <ThemedText className="text-sm text-muted-foreground">{offer.property.description}</ThemedText>
        
        {/* Action Button */}
        {
          (offer.status === 'PENDING') ? <TouchableOpacity
          className="w-full flex-row items-center justify-center gap-2 mt-2 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.buttonBackground,
          }}
          onPress={() => {
            handleWithdrawOffer(offer.property.id.toString());
          }}
        >
          <ThemedText className="text-base font-bold" style={{ color: colors.buttonTextColor }}>
            {t('withdraw_offer')}
          </ThemedText>
          <Ionicons name={'arrow-undo-circle-outline'} size={22} color={colors.buttonTextColor} />
        </TouchableOpacity> : (
          (offer.status === 'COUNTERED') && <TouchableOpacity
            className="w-full flex-row items-center justify-center gap-2 mt-2 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: colors.buttonBackground,
            }}
            onPress={handleAcceptCounteredOffer}
            >
            <ThemedText className="text-base font-bold" style={{ color: colors.buttonTextColor }}>
              {t('accept_countered_offer')}
            </ThemedText>
            <Ionicons name={'swap-horizontal-outline'} size={22} color={colors.buttonTextColor} />
          </TouchableOpacity>
        )
        }
        
      </ThemedView>
    </ThemedView>
  );
};

export default OfferCard;