import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RoleCard } from '@/components/RoleCard';
import { RoleData } from '@/components/types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const RoleSelection: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { availableRoles, setActiveRole } = useAuth();

  const getRoleMeta = (roleName: string) : Partial<RoleData> => {
    switch (roleName) {
      case 'ROLE_AGENT':
        return {
          id: 'agent', // ID interno per il reindirizzamento
          title: t('agentTitle'),
          description: t('agentDescription'),
          iconUrl: 'material-symbols:business-center-outline',
          accessibilityLabel: t('selectAgentRole'),
        };
      case 'ROLE_MANAGER': // Assumiamo che ROLE_MANAGER sia l'admin
        return {
          id: 'admin', // ID interno per il reindirizzamento
          title: t('adminTitle'),
          description: t('adminDescription'),
          iconUrl: 'material-symbols:admin-panel-settings-outline',
          accessibilityLabel: t('selectAdminRole'),
        };
      // Aggiungi altri casi se ci sono altri ruoli specifici dal backend
      // Se il backend invia "ROLE_BUYER", puoi aggiungere un case specifico
      // case 'ROLE_BUYER':
      //   return {
      //     id: 'buyer',
      //     title: t('userTitle'),
      //     description: t('userDescription'),
      //     iconUrl: 'material-symbols:house-outline',
      //     accessibilityLabel: t('selectUserRole'),
      //   };
      default:
        // Questo default dovrebbe catturare ruoli non esplicitamente gestiti o il caso base
        return {
          id: 'buyer', // Fallback a buyer per ruoli non riconosciuti o base
          title: t('userTitle'),
          description: t('userDescription'),
          iconUrl: 'material-symbols:house-outline',
          accessibilityLabel: t('selectUserRole'),
        };
    }
  };

  const handleRoleSelect = async (roleId: string) => {
    try {
      await setActiveRole(roleId);
      // Dopo aver salvato il ruolo, reindirizza alla dashboard corretta
      switch (roleId) {
        case 'agent':
          router.replace('/(protected)/(agent)/(tabs)/home' as any);
          break;
        case 'admin':
          router.replace('/(protected)/(admin)/(tabs)/home' as any);
          break;
        default:
          router.replace('/(protected)/(buyer)/(tabs)/home' as any);
      }
    } catch (err) {
      console.error('Errore durante la selezione ruolo:', err);
    }
  };

  const roleData: RoleData[] = [];

  if (availableRoles && availableRoles.length > 0) {
    // Aggiungi i ruoli specifici disponibili
    availableRoles.forEach((r) => {
      const meta = getRoleMeta(r);
      roleData.push({
        id: meta.id || r,
        title: meta.title || String(r),
        description: meta.description || '',
        iconUrl: meta.iconUrl || 'material-symbols:house-outline',
        route: '',
        accessibilityLabel: meta.accessibilityLabel || ''
      } as RoleData);
    });
    // Aggiungi sempre il ruolo 'buyer' come opzione aggiuntiva se ci sono altri ruoli
    roleData.push({
      id: 'buyer',
      title: t('userTitle'),
      description: t('userDescription'),
      iconUrl: 'material-symbols:house-outline',
      route: '',
      accessibilityLabel: t('selectUserRole')
    });
  }

  return (
    <ThemedView className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="p-4">
        <ThemedView className="flex justify-center items-center mb-8 w-full text-center max-w-[800px] max-sm:mb-6">
          <ThemedView className="relative mb-2">
            <ThemedText type="title" className='text-4xl font-semibold tracking-normal leading-tight text-center pb-4'>
              {t('welcome')}
            </ThemedText>
          </ThemedView>
          <ThemedView className="mx-auto my-0 max-w-[600px]">
            <ThemedText className="text-lg font-light tracking-wider leading-relaxed text-center text-slate-500 pb-8">
              {t('intro')}
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
              onSelect={() => handleRoleSelect(role.id)}
              accessibilityLabel={role.accessibilityLabel}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default RoleSelection;