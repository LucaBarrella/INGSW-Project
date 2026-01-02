import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '@/components/Buyer/SearchIntegration/SegmentedControl';
import OffersTab from '@/app/(protected)/(buyer)/(tabs)/offers';
import ReceivedOffersTab from '@/app/(protected)/(agent)/(tabs)/receivedOffers';
import { ThemedView } from '@/components/ThemedView';

/**
 * AgentOffersScreen component.
 * Groups "My Offers" and "Received Offers" into a single screen with a SegmentedControl.
 */
export default function AgentOffersScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'myOffers' | 'receivedOffers'>('myOffers');

  const tabs = [
    { label: t('agent.tabs.offers'), value: 'myOffers' as const },
    { label: t('agent.tabs.receivedOffers'), value: 'receivedOffers' as const },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <SegmentedControl
          options={tabs}
          value={activeTab}
          onChange={(val) => val && setActiveTab(val)}
        />
      </View>
      <View style={styles.content}>
        {activeTab === 'myOffers' ? <OffersTab /> : <ReceivedOffersTab />}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
});