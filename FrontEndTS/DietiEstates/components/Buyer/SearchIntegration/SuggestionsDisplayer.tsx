import React from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from "react-native";
import { PhotonFeature } from "./types";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from '@/hooks/useThemeColor';

interface SuggestionsDisplayerProps {
  suggestions: PhotonFeature[];
  onSelectSuggestion: (suggestion: PhotonFeature) => void;
  filterType?: "house" | "city" | "country" | "street" | "state";
  containerStyle?: any;
}

export const SuggestionsDisplayer: React.FC<SuggestionsDisplayerProps> = ({
  suggestions,
  onSelectSuggestion,
  filterType = undefined,
  containerStyle
}) => {
  const backgroundColor = useThemeColor({}, 'propertyCardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  // Rimuoviamo il filtraggio troppo stringente per permettere una ricerca più libera
  const filteredSuggestions = suggestions;

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <View
      style={[{
        maxHeight: 250,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }, containerStyle]}
      className="overflow-hidden"
    >
      <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
        {filteredSuggestions.map((item, index) => (
          <TouchableOpacity
            key={`${item.properties?.osm_id ?? item.label ?? 'suggestion'}-${index}`}
            onPress={() => onSelectSuggestion(item)}
            className="py-4 px-4 border-t"
            style={{ borderTopColor: borderColor }}
          >
            <ThemedText className="text-sm font-medium" style={{ color: textColor }}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};