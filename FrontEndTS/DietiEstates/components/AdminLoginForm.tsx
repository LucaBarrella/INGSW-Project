import React from 'react';
import LoginForm from './LoginForm';

const AdminLoginForm: React.FC = () => {
  return <LoginForm userType="admin" />;
};

export default AdminLoginForm;