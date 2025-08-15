import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedIcon } from "@/components/ThemedIcon";
import { PropertyDetail } from "./types";
import { PropertyCharacteristicsDisplay, mapPropertyDetailToCharacteristics } from '@/components/Property/PropertyCharacteristicsDisplay';
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertyRowProps {
  property: PropertyDetail;
  isPinned: boolean;
  onTogglePin: () => void;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({
  property,
  isPinned,
  onTogglePin,
}) => {
  const { t } = useTranslation();

  const propertyCardBg = useThemeColor({}, 'propertyCardBackground');
  const tintColor = useThemeColor({}, 'tint');
  const availableColor = useThemeColor({}, 'visitStatusAccepted');
  const soldColor = useThemeColor({}, 'visitStatusRejected');
  const rentedColor = useThemeColor({}, 'visitStatusPending');
  const iconColor = useThemeColor({}, 'text');
  const textColor = useThemeColor({}, 'propertyCardDetail');
  const borderColor = useThemeColor({}, 'border');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return availableColor;
      case "sold":
        return soldColor;
      case "rented":
        return rentedColor;
      default:
        return textColor;
    }
  };

  return (
    <ThemedView
      className="rounded-xl shadow-md mx-4 overflow-hidden"
      style={{
        backgroundColor: propertyCardBg,
        ...(isPinned && {
          borderWidth: 2,
          borderColor: borderColor
        })
      }}
    >
      <ThemedView
        className="flex flex-row justify-between p-4 max-sm:flex-col max-sm:gap-3"
        style={{ backgroundColor: propertyCardBg }}
      >
        <ThemedView
          className="flex-1 flex-row items-center gap-3"
          style={{ backgroundColor: propertyCardBg }}
        >
          <TouchableOpacity
            onPress={onTogglePin}
            accessibilityLabel={isPinned ? t("unpinProperty") : t("pinProperty")}
            className="p-1 active:opacity-70"
          >
            <ThemedIcon
              icon={isPinned ? "material-symbols:push-pin" : "material-symbols:push-pin-outline"}
              size={24}
              lightColor={isPinned ? tintColor : '#9ca3af'}
              darkColor={isPinned ? tintColor : '#9ca3af'}
              accessibilityLabel={isPinned ? t("unpinProperty") : t("pinProperty")}
            />
          </TouchableOpacity>
          <ThemedText className="font-medium text-base flex-1">
            {t(property.propertyCategory)} in {property.address.city}, {t(property.status)}
          </ThemedText>
        </ThemedView>
        <ThemedView
          className="flex-row items-center gap-6 max-sm:flex-col max-sm:gap-3 max-sm:items-start"
          style={{ backgroundColor: propertyCardBg }}
        >
          <ThemedView
            className="flex-row items-center gap-1"
            style={{ backgroundColor: propertyCardBg }}
          >
            <ThemedIcon
              icon="material-symbols:home-outline"
              size={20}
              lightColor={iconColor}
              darkColor={iconColor}
              accessibilityLabel={t("propertyType")}
            />
            <ThemedText style={{ color: textColor }}>{property.type}</ThemedText>
          </ThemedView>
          <ThemedView
            className="flex-row items-center gap-1"
            style={{ backgroundColor: propertyCardBg }}
          >
            <ThemedIcon
              icon="material-symbols:visibility-outline-rounded"
              size={20}
              lightColor={iconColor}
              darkColor={iconColor}
              accessibilityLabel={t("propertyViews")}
            />
            <ThemedText style={{ color: textColor }}>
              {property.views} {t("views")}
            </ThemedText>
          </ThemedView>
          <ThemedView
            className="flex-row items-center gap-1"
            style={{ backgroundColor: propertyCardBg }}
          >
            <ThemedIcon
              icon="material-symbols:calendar-month-outline"
              size={20}
              lightColor={iconColor}
              darkColor={iconColor}
              accessibilityLabel={t("propertyBookings")}
            />
            <ThemedText style={{ color: textColor }}>
              {property.bookings} {t("bookings")}
            </ThemedText>
          </ThemedView>
          <ThemedView
            className="flex-row items-center gap-1"
            style={{ backgroundColor: propertyCardBg }}
          >
            <ThemedIcon
              icon="material-symbols:attach-money"
              size={20}
              lightColor={iconColor}
              darkColor={iconColor}
              accessibilityLabel={t("propertyPrice")}
            />
            <ThemedText style={{ color: textColor }}>${property.price}</ThemedText>
          </ThemedView>
          {/* >>> INIZIO INTEGRAZIONE CARATTERISTICHE <<< */}
          <PropertyCharacteristicsDisplay property={mapPropertyDetailToCharacteristics(property)} />
          {/* >>> FINE INTEGRAZIONE CARATTERISTICHE <<< */}
          <ThemedView
            className="px-2 py-0.5 rounded-xl"
            style={{ backgroundColor: getStatusColor(property.status) }}
          >
            <ThemedText
              className="text-sm font-medium"
              style={{
                color: '#ffffff',
              }}
            >
              {t(property.status.toUpperCase())}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
