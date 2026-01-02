import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '@/components/Buyer/SearchIntegration/SegmentedControl';
import AgendaScreen from '@/components/Agent/Agenda/AgendaScreen';
import VisitsTab from '@/app/(protected)/(buyer)/(tabs)/visits';
import { ThemedView } from '@/components/ThemedView';

/**
 * ActivityScreen component for Agents.
 * Groups Agenda and Visits into a single screen with a SegmentedControl.
 */
export default function ActivityScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'agenda' | 'visits'>('agenda');

  const tabs = [
    { label: t('agent.tabs.agenda'), value: 'agenda' as const },
    { label: t('agent.tabs.visits'), value: 'visits' as const },
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
        {activeTab === 'agenda' ? <AgendaScreen /> : <VisitsTab />}
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