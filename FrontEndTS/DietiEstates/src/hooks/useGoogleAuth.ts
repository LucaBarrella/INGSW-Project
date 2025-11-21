import * as Google from 'expo-auth-session/providers/google';
import React from 'react';

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({

    //TODO DA TOGLIERE E METTERE NEL FILE .ENV!!! FAST
    clientId: '68500182941-19rccqu4iigg9mcj062rf3t9blgjg5h5.apps.googleusercontent.com',
    webClientId: '68500182941-19rccqu4iigg9mcj062rf3t9blgjg5h5.apps.googleusercontent.com',
    androidClientId: '68500182941-q8cp0sg6nvpq4tpr3ct30invplj34ets.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);


  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        setIdToken(id_token);
      }
    } else if (response?.type === 'error') {
      setError(response.params.error_description || 'An error occurred');
    }
  }, [response]);

  return { request, promptAsync, idToken, error };
};