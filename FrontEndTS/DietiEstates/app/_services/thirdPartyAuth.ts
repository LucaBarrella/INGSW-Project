import { Alert } from 'react-native';
import httpClient from './httpClient';
import { saveRefreshToken, saveToken } from './token.service';
import React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { AuthSessionResult } from 'expo-auth-session';
import { Router } from 'expo-router';

const sendGoogleTokenToBackend = async (token: string) => {
  return await httpClient.post('/auth/google', { "idToken": token });
}

const handleError = (error: string, router: Router) => {
  Alert.alert(`Autenticazione fallita`, error);
  router.replace('/(auth)/login');
};

const loginWithGoogle = (response: AuthSessionResult | null, router: Router) => {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    sendGoogleTokenToBackend(id_token).then(async (response) => {
      if (response.status < 300) {
        const data = response?.data;
        await saveToken(data.accessToken);
        await saveRefreshToken(data.refreshToken);
        router.replace('/(protected)/(buyer)/(tabs)/home');
      }
      else {
        handleError("Non siamo riusciti a completare l'autenticazione, riprova più tardi.", router);
      }
    }).catch(() => {
      handleError("Errore di connessione, riprova più tardi.", router);
    });
  }
  else if (response?.type === 'error') {
    handleError("Non siamo riusciti a raggiungere il servizio di autenticazione, riprova più tardi.", router);
  }
}

export default function useGoogleAuth(router: Router) {

  const WEB_CLIENT_ID = '68500182941-19rccqu4iigg9mcj062rf3t9blgjg5h5.apps.googleusercontent.com';
  const ANDROID_CLIENT_ID = '68500182941-q8cp0sg6nvpq4tpr3ct30invplj34ets.apps.googleusercontent.com';
  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    scopes: ['profile', 'email']
  });

  React.useEffect(()=>{loginWithGoogle(response, router)}, [response]);

  const googleSignIn = async () => {
    try {
      const result = await promptAsync();
      return result;
    } catch (error) {
      Alert.alert("Errore", "Non siamo riusciti ad avviare il servizio di autenticazione, riprova più tardi.");
      return null;
    }
  };

  return {
    googleSignIn
  };
}