import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArchiveFilter } from '@/components/Offer/ArchiveFilter';
import { ArchivedOffersList } from '@/components/Offer/ArchivedOffersList';

export default function ArchiveScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const [selectedFilter, setSelectedFilter] = useState<'accepted' | 'rejected'>('accepted');

  return (
    <ThemedView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <ArchiveFilter selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
      <ArchivedOffersList filter={selectedFilter} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});