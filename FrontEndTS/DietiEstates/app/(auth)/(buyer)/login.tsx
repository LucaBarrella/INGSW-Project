import React from 'react';
import LoginForm from '@/components/LoginForm';
import { ThemedView } from '@/components/ThemedView';

const LoginBuyer = () => {
  return (
    <ThemedView className="flex-1 bg-indigo-50 justify-center items-center">
      <LoginForm/>
    </ThemedView>
  );
};

export default LoginBuyer;