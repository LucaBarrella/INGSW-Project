import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Offer } from '@/app/_services/__mocks__/offersMockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface OfferCardProps {
  offer: Offer;
}

const StatusBadge = ({ status, color, icon }: { 
  status: string; 
  color: string; 
  icon: IconName 
}) => {
  return (
    <ThemedView 
      className="absolute top-3 right-3 flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ 
        backgroundColor: `${color}99`, 
        borderColor: `${color}40`,
        borderWidth: 1,
      }}
    >
      <Ionicons name={icon} size={14} color={"#FFFFFF"} />
      <ThemedText className="font-bold" style={{ color: "#FFFFFF" }}>{status}</ThemedText>
    </ThemedView>
  );
};

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusInfo = (status: Offer['status']): { color: string; icon: IconName; text: string } => {
    switch (status) {
      case 'accettata':
        return {
          color: colors.visitStatusAccepted,
          icon: 'checkmark-circle-outline',
          text: 'Accettata',
        };
      case 'rifiutata':
        return {
          color: colors.visitStatusRejected,
          icon: 'close-circle-outline',
          text: 'Rifiutata',
        };
      case 'in attesa':
        return {
          color: colors.visitStatusPending,
          icon: 'time-outline',
          text: 'In attesa',
        };
      default:
        return {
          color: colors.text,
          icon: 'help-circle-outline',
          text: 'Sconosciuto',
        };
    }
  };

  const statusInfo = getStatusInfo(offer.status);

  return (
    <ThemedView className="bg-background rounded-xl m-4 shadow-lg border-border" style={{ backgroundColor: 'transparent' }}>
      <ThemedView className="relative" style={{ backgroundColor: 'transparent' }}>
        <Image 
          source={{ uri: offer.imageUrl }} 
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
          <ThemedText className="text-lg font-semibold flex-1">{offer.address}</ThemedText>
        </View>
        
        {/* Financial and Date Details */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="cash-outline" size={16} color={colors.text} />
            <ThemedText className="text-muted-foreground">{offer.amount}</ThemedText>
          </View>
          
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="calendar-outline" size={16} color={colors.text} />
            <ThemedText className="text-muted-foreground">{offer.date}</ThemedText>
          </View>
        </View>
        
        {/* Description */}
        <ThemedText className="text-sm text-muted-foreground">{offer.actionDescription}</ThemedText>
        
        {/* Action Button */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center gap-2 mt-2 px-4 py-3 rounded-lg"
          style={{
            backgroundColor: colors.buttonBackground,
          }}
        >
          <ThemedText className="text-base font-bold" style={{ color: colors.buttonTextColor }}>
            {offer.actionText}
          </ThemedText>
          <Ionicons name={offer.actionIcon} size={22} color={colors.buttonTextColor} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default OfferCard;