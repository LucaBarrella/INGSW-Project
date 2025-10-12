import { Alert } from 'react-native';
import httpClient from './httpClient';
import { saveRefreshToken, saveToken } from './token.service';
import React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { AuthSessionResult } from 'expo-auth-session';
import { Router } from 'expo-router';

export const updateTokensByThirdPartyLogin = async (token: string) => {
  return await httpClient.post('/auth/google', { "idToken": token });
}

export const loginWithGoogle = (response: { type: string; params: { id_token: string; access_token: string }; error: any; }, router: Router) => {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    updateTokensByThirdPartyLogin(id_token).then(async (response) => {
      if (response.status == 200) {
        const data = response?.data;
        await saveToken(data.accessToken);
        await saveRefreshToken(data.refreshToken);
        router.replace('/(protected)/(buyer)/(tabs)/home');
      }
      else {
        Alert.alert("Login fallito", "Qualcosa è andato storto, controlla i dati inseriti e riprova.");
        router.replace('/(auth)/login');
      }
    }).catch((error) => {
      Alert.alert("Login fallito", "Qualcosa è andato storto, controlla la connessione e riprova.");
      router.replace('/(auth)/login');
    });
  }
  else if (response?.type === 'error') {
    Alert.alert("Login fallito", "Non siamo riusciti a raggiungere il servizio di autenticazione, riprova più tardi.");
    router.replace('/(auth)/login');
  }
}

export default function useGoogleAuth(useEffectCallback: { (response: any): void; (arg0: AuthSessionResult | null): void; }) {

  const WEB_CLIENT_ID = '68500182941-19rccqu4iigg9mcj062rf3t9blgjg5h5.apps.googleusercontent.com';
  const ANDROID_CLIENT_ID = '68500182941-q8cp0sg6nvpq4tpr3ct30invplj34ets.apps.googleusercontent.com';
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
    useProxy: true
  });

  React.useEffect(()=>{useEffectCallback(response)}, [response]);

  const googleSignIn = async () => {
    try {
      const result = await promptAsync();
      return result;
    } catch (error) {
      Alert.alert("error! " + JSON.stringify(error));
      return null;
    }
  };

  return {
    googleSignIn
  };
}