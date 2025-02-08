import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RoleCard } from '@/components/RoleCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RoleData } from '@/components/types';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleActionSelect = (route: string) => {
    router.push(route as any);
  };

  const actionData: RoleData[] = [
    {
      id: 'change-password',
      title: t('admin.changePassword'),
      description: t('admin.changePasswordDesc'),
      iconUrl: 'material-symbols:key-outline',
      route: '/(admin)/(tabs)/change-password',
      accessibilityLabel: t('admin.changePassword')
    },
    {
      id: 'add-admin',
      title: t('admin.addAdmin'),
      description: t('admin.addAdminDesc'),
      iconUrl: 'material-symbols:person-add-outline',
      route: '/(admin)/(tabs)/add-admin',
      accessibilityLabel: t('admin.addAdmin')
    },
    {
      id: 'add-agent',
      title: t('admin.addAgent'),
      description: t('admin.addAgentDesc'),
      iconUrl: 'material-symbols:real-estate-agent-outline',
      route: '/(admin)/(tabs)/add-agent',
      accessibilityLabel: t('admin.addAgent')
    }
  ];

  return (
    <ThemedView className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="p-4">
      <ThemedView className="flex justify-center items-center mb-8 w-full text-center max-w-[800px] max-sm:mb-6">
          <ThemedView className="relative mb-2">
            <ThemedText type="title" className="text-4xl font-semibold tracking-normal leading-tight text-center pb-4">
              {t('admin.welcome')}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="flex flex-col gap-12 px-4 py-0 w-full max-w-[520px] mx-auto">
          {actionData.map((action) => (
            <RoleCard
              key={action.id}
              title={action.title}
              description={action.description}
              iconUrl={action.iconUrl}
              onSelect={() => handleActionSelect(action.route)}
              accessibilityLabel={action.accessibilityLabel}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
