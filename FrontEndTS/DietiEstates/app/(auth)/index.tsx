import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RoleCard } from '@/components/RoleCard';
import { RoleData } from '@/components/types';

const roleData: RoleData[] = [
  {
    id: 'user',
    title: 'Cerca Casa',
    description: 'Esplora e trova la tua casa ideale',
    iconUrl: 'material-symbols:key-outline', // Nome dell'icona
    route: '/(auth)/(user)/login',
    accessibilityLabel: 'Seleziona ruolo utente per cercare casa'
  },
  {
    id: 'agent',
    title: 'Agente Immobiliare',
    description: 'Gestisci annunci e clienti',
    iconUrl: 'material-symbols:business-center-outline', // Nome dell'icona
    route: '/(auth)/(agent)/login',
    accessibilityLabel: 'Seleziona ruolo agente immobiliare'
  },
  {
    id: 'admin',
    title: 'Amministratore',
    description: 'Gestisci agenti immobiliari e configura il sistema',
    iconUrl: 'material-symbols:admin-panel-settings-outline', // Nome dell'icona
    route: '/(auth)/(admin)/login',
    accessibilityLabel: 'Seleziona ruolo amministratore'
  }
];

const RoleSelection: React.FC = () => {
  const router = useRouter();

  const handleRoleSelect = (route: string) => {
    router.push(route as any);
  };

  return (
    <ThemedView className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <ThemedView className="mb-8 w-full text-center max-w-[800px] max-sm:mb-6">
          <ThemedView className="relative mb-2">
            <ThemedText type="title" className='text-6xl font-semibold tracking-normal leading-tight text-center pb-4'>
              Benvenuto!
            </ThemedText>
          </ThemedView>
          <ThemedView className="mx-auto my-0 max-w-[600px]">
            <ThemedText className="text-lg font-light tracking-wider leading-relaxed text-center text-slate-500 pb-8">
              Ti aiuteremo a trovare il percorso giusto per te
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView className="flex flex-col gap-12 px-4 py-0 w-full max-w-[520px]">
          {roleData.map((role) => (
            <RoleCard
              key={role.id}
              title={role.title}
              description={role.description}
              iconUrl={role.iconUrl}
              onSelect={() => handleRoleSelect(role.route)}
              accessibilityLabel={role.accessibilityLabel}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default RoleSelection;