import React from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LANGUAGE_KEY } from '@/app/_utils/i18n';

interface SettingOptionProps {
  title: string;
  value: string;
  onPress: () => void;
}

const SettingOption: React.FC<SettingOptionProps> = ({ title, value, onPress }) => {
  const borderColor = useThemeColor({}, 'border');
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4"
      style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}
    >
      <ThemedText className="text-base">{title}</ThemedText>
      <ThemedView className="flex-row items-center">
        <ThemedText className="text-gray-600 mr-2">{value}</ThemedText>
        <ThemedIcon
          icon="material-symbols:chevron-right"
          size={24}
          accessibilityLabel="Seleziona"
        />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');

  const languages = [
    { code: 'it', name: 'Italiano' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = async () => {
    Alert.alert(
      t('settings.language'),
      '',
      languages.map(lang => ({
        text: lang.name,
        onPress: async () => {
          try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang.code);
            await i18n.changeLanguage(lang.code);
          } catch (error) {
            console.error('Error saving language:', error);
          }
        }
      })),
      { cancelable: true }
    );
  };

  // Ottiene il nome della lingua corrente
  const getCurrentLanguageName = () => {
    const languageMap: { [key: string]: string } = {
      'it': 'Italiano',
      'en': 'English',
      'es': 'Español',
      'fr': 'Français'
    };
    return languageMap[i18n.language] || i18n.language;
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ScrollView>
        <ThemedView className="mt-4">
          <SettingOption
            title={t('settings.language')}
            value={getCurrentLanguageName()}
            onPress={handleLanguageChange}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}