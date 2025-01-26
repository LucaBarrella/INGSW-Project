import { SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import {ThemedView} from '@/components/ThemedView';
import RegistrationForm from '@/components/RegistrationForm';

const RegisterBuyer = () => {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView/>
        <ScrollView className="flex-1">
          <ThemedView className="flex-1 justify-center items-center">
            <RegistrationForm/>
          </ThemedView>
        </ScrollView>
      <SafeAreaView/>
    </ThemedView>
  );
}

export default RegisterBuyer;
