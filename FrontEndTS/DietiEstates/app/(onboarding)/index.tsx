import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingStep from '@/components/onboarding/OnboardingStep';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';

const IMAGES = [
  require('../../assets/images/OnboardingScreen1.jpg'),
  require('../../assets/images/OnboardingScreen2.jpg'),
  require('../../assets/images/OnboardingScreen3.jpg'),
  require('../../assets/images/OnboardingScreen4.jpg'),
];

const TITLES = [
  'La Scoperta',
  'La Semplificazione',
  'Il Superpotere',
  'Benvenuto',
];

const DESCRIPTIONS = [
  'Scopri proprietà, agenti e tutto quello che ti serve per trovare la casa ideale.',
  'Organizza visite e appuntamenti in modo semplice, tutto in un unico posto.',
  'Accedi a strumenti potenti che ti permettono di prendere decisioni più rapide.',
  'Inizia subito: registrati per sbloccare tutte le funzionalità.',
];

export default function Onboarding() {
  const pagerRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  // Theme-aware colors (usate qui per mantenere coerenza con il ThemeProvider)
  const bg = useThemeColor({}, 'background');
  const dotDefault = useThemeColor({}, 'border');
  const dotActive = useThemeColor({}, 'tint');
  // use buttonTextColor for links/dots contrast consistency
  const loginLinkColor = useThemeColor({}, 'text');

  const handlePageSelected = (e: any) => {
    const position = e.nativeEvent.position ?? 0;
    setPage(position);
  };

  const goNext = () => {
    const next = Math.min(page + 1, IMAGES.length - 1);
    pagerRef.current?.setPage(next);
    setPage(next);
  };

  const auth = useAuth();

  const completeOnboarding = async () => {
    try {
      // Usa l'API del context per aggiornare sia AsyncStorage che lo stato del context
      // in modo atomico e prevenire condizioni di gara.
      await auth.completeOnboarding();
      // Non eseguire navigazione esplicita qui: AuthContext rileverà il cambio di stato
      // e reindirizzerà verso /(auth). Se preferisci navigare immediatamente, usa:
      // router.replace('/(auth)');
    } catch (err) {
      console.error('Errore durante il completamento dell\'onboarding:', err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
        ref={pagerRef}
      >
        {IMAGES.map((src, idx) => (
          <View key={idx} style={{ flex: 1 }}>
            <OnboardingStep
              imageSource={src}
              title={TITLES[idx]}
              description={DESCRIPTIONS[idx]}
              primaryLabel={idx === IMAGES.length - 1 ? 'Inizia Ora' : 'Avanti'}
              onPrimaryPress={idx === IMAGES.length - 1 ? completeOnboarding : goNext}
              showPager={
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                  {IMAGES.map((_, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: i === page ? dotActive : dotDefault,
                        width: i === page ? 20 : 8,
                        height: 8,
                        borderRadius: 8,
                        marginHorizontal: 8,
                      }}
                    />
                  ))}
                </View>
              }
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}
