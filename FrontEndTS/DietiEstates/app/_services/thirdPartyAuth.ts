import { Alert } from 'react-native';
import httpClient from './httpClient';
import { saveRefreshToken, saveToken } from './token.service';
import React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { AuthSessionResult } from 'expo-auth-session';
import { Router } from 'expo-router';

export const updateTokensByThirdPartyLogin = async (token: string) => {
    return await httpClient.post('/auth/google', { "token": token });
}

export const loginWithGoogle = (response: { type: string; params: { id_token: string; access_token: string }; error: any; }, router: Router) => {
  Alert.alert(JSON.stringify(response));
  if (response?.type === 'success') {
    const { access_token } = response.params;
    const { id_token } = response.params;
    updateTokensByThirdPartyLogin(id_token).then(async (response) => {
      if (response.status == 200) {
        const data = JSON.parse(response?.data);
        await saveToken(data.accessToken);
        await saveRefreshToken(data.refreshToken);
        Alert.alert("redirecting...");
        router.replace('/(protected)/(buyer)/(tabs)/home');
      }
      else {
        Alert.prompt("Autenticazione fallita", JSON.parse(response?.data).message);
        router.back();
      }
    }, (error) => {
      Alert.prompt(JSON.stringify(error));
      console.log("UWUFUFU");
      console.log(JSON.stringify(error));
      if (error.status == 404) {
        fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        })
          .then(response => response.json())
          .then(userData => {
            const password = "";
            const email = userData.email;
            const name = userData.given_name;
            const surname = userData.family_name;
            // TODO should ask for username and then sign up.
            const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
            httpClient.post('/register', { username: username, name: name, surname: surname, email: email, password: password, id_token: id_token }).then((response) => {
              if (response.status == 201) {
                Alert.alert("Registrazione avvenuta con successo", "Ora puoi effettuare il login.");
                router.push({ pathname: "/(auth)/login", params: { email: email, password: password } });
              }
              else {
                Alert.alert("Registrazione fallita", JSON.parse(response?.data).message);
                router.back();
              }
            }, (error) => {
              Alert.alert("Registrazione fallita", JSON.parse(error?.data).message);
              router.back();
            });
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
            Alert.alert("Registrazione fallita", "Qualcosa è andato storto, controlla la connessione e riprova.");
            router.back();
          });
      }
      else {
        Alert.alert("Registrazione fallita", JSON.parse(error?.data).message);
        router.back();
      }
    })
  }
  else if (response?.type === 'error') {
    console.error("Auth error:", response.error);
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