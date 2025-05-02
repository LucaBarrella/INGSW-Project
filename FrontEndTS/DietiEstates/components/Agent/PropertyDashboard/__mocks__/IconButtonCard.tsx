import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

// Mock semplificato di IconButtonCard che non usa react-native-iconify
const MockIconButtonCard = ({
  title,
  onSelect,
  accessibilityLabel
}: {
  title: string;
  onSelect: () => void;
  accessibilityLabel: string;
  iconUrl?: string; // reso opzionale poiché non lo useremo nel mock
  className?: string;
  textDimensions?: number;
  iconSize?: number;
}) => (
  <TouchableOpacity
    onPress={onSelect}
    accessibilityLabel={accessibilityLabel}
    testID="mock-icon-button-card" // Aggiunto testID per facilitare la selezione nei test
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default MockIconButtonCard;