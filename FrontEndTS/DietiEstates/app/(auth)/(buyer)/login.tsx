import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import LoginForm from '@/components/LoginForm';

export default function BuyerLogin() {
  return (
    <ThemedView className="flex-1 bg-indigo-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <ThemedView className="flex-1 justify-center items-center">
          <LoginForm userType="buyer" />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
