import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import RegistrationForm from '@/components/RegistrationForm';

export default function BuyerRegistration() {
  return (
    <ThemedView className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <ThemedView className="flex-1 justify-center items-center">
          <RegistrationForm />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
