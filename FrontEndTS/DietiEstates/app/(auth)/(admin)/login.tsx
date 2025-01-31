import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import AdminLoginForm from '@/components/AdminLoginForm';

const LoginAdmin = () => {
  return (
    <ThemedView className="flex-1 bg-indigo-50 justify-center items-center">
      <AdminLoginForm/>
    </ThemedView>
  );
}

export default LoginAdmin;
