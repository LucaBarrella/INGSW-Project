import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ArchiveFilterProps {
  selectedFilter: 'accepted' | 'rejected';
  onSelectFilter: (filter: 'accepted' | 'rejected') => void;
}

export function ArchiveFilter({ selectedFilter, onSelectFilter }: ArchiveFilterProps) {
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  return (
    <View style={[styles.container, { borderColor: borderColor }]}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedFilter === 'accepted' && { backgroundColor: buttonBackground },
        ]}
        onPress={() => onSelectFilter('accepted')}
      >
        <Text style={[styles.buttonText, { color: selectedFilter === 'accepted' ? buttonTextColor : text }]}>
          Offerte Accettate
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedFilter === 'rejected' && { backgroundColor: buttonBackground },
        ]}
        onPress={() => onSelectFilter('rejected')}
      >
        <Text style={[styles.buttonText, { color: selectedFilter === 'rejected' ? buttonTextColor : text }]}>
          Offerte Rifiutate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    // borderColor: '#ccc', // This line is no longer needed as borderColor is passed via style prop
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});