import React from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useTranslation } from 'react-i18next';
 
/**
 * HistoryPlaceholder
 * Solo tailwind utility per evitare conflitti di stile e overflow orizzontale.
 */
 
const HistoryPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ThemedView className="w-full px-4 py-8 items-center justify-center">
      <View className="mb-3">
        <ThemedIcon icon="material-symbols:history-rounded" size={48} accessibilityLabel="Empty history" />
      </View>
 
      <View className="w-full max-w-[360px] px-4">
        <ThemedText className="text-center text-gray-500">
          {t('history_placeholder.no_viewed_properties')}
        </ThemedText>
        <ThemedText className="text-center text-gray-500 mt-1">
          {t('history_placeholder.when_you_do')}
        </ThemedText>
      </View>
    </ThemedView>
  );
};
 
export default HistoryPlaceholder;