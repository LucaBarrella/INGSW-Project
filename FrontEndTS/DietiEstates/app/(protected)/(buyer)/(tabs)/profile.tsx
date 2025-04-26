import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ProfileOption {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function ProfileTab() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  // TODO: Replace with real user data
  const mockUser = {
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
  };

  const profileOptions: ProfileOption[] = [
    {
      id: 'edit-profile',
      title: 'Modifica Profilo',
      icon: 'mdi:account-edit',
      onPress: () => console.log('Edit profile')
    },
    {
      id: 'settings',
      title: 'Impostazioni',
      icon: 'mdi:cog',
      onPress: () => console.log('Settings')
    },
    {
      id: 'help',
      title: 'Aiuto',
      icon: 'mdi:help-circle',
      onPress: () => console.log('Help')
    },
    {
      id: 'logout',
      title: 'Esci',
      icon: 'mdi:logout',
      onPress: () => {
        // TODO: Implement proper logout
        router.replace('/(auth)');
      }
    }
  ];

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ThemedView className="p-4 bg-white">
        <ThemedText className="text-xl font-semibold">
          Profilo
        </ThemedText>
      </ThemedView>

      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <ThemedView 
          className="p-4 mb-6 rounded-lg bg-white"
          style={{ borderWidth: 1, borderColor }}
        >
          <ThemedIcon 
            icon="mdi:account-circle"
            size={60}
            accessibilityLabel="Profile picture"
          />
          <ThemedText className="text-xl font-semibold mt-2">
            {mockUser.name}
          </ThemedText>
          <ThemedText className="text-gray-600">
            {mockUser.email}
          </ThemedText>
        </ThemedView>

        {/* Options */}
        <ThemedView 
          className="rounded-lg bg-white overflow-hidden"
          style={{ borderWidth: 1, borderColor }}
        >
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={option.onPress}
              className="flex-row items-center p-4"
              style={{
                borderTopWidth: index > 0 ? 1 : 0,
                borderTopColor: borderColor
              }}
            >
              <ThemedIcon 
                icon={option.icon}
                size={24}
                accessibilityLabel={option.title}
                className="mr-3"
              />
              <ThemedText className="flex-1">
                {option.title}
              </ThemedText>
              <ThemedIcon 
                icon="mdi:chevron-right"
                size={24}
                accessibilityLabel="Vai"
              />
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
