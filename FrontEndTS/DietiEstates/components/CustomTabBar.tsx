import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const iconMap: Record<string, React.ComponentProps<typeof MaterialIcons>['name']> = {
  home: 'home',
  visits: 'calendar-today',
  activity: 'event-note',
  offers: 'receipt',
  agentOffers: 'receipt',
  profile: 'person',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const activeTintColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveTintColor = Colors[colorScheme ?? 'light'].tabIconDefault;

  // Calcoliamo una posizione bottom ottimizzata
  // Se c'è una safe area (iPhone X+), usiamo quella ma ridotta per avvicinare la barra
  // Se non c'è (Android/iPhone vecchi), usiamo un margine standard
  const bottomOffset = insets.bottom > 0 ? insets.bottom - 10 : 20;
  
  // Recuperiamo i colori definiti nel brand
  const brandBackground = Colors[colorScheme ?? 'light'].tabBarBackground;
  
  // Convertiamo il colore esadecimale in RGBA per mantenere l'effetto vetro
  // Se il colore non è definito, usiamo un fallback sicuro
  const glassBackgroundColor = brandBackground
    ? `${brandBackground}${colorScheme === 'dark' ? 'B3' : 'D9'}` // B3 = 70%, D9 = 85% opacità
    : (colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)');

  return (
    <View style={[styles.tabBarContainer, { bottom: bottomOffset }]}>
      <View style={styles.shadowContainer}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 40 : 100}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={[styles.blurContainer, { backgroundColor: glassBackgroundColor }]}
        >
          <View style={styles.tabBarContent}>
            {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

            // Skip routes that don't have a defined icon mapping
            if (!iconMap[route.name as keyof typeof iconMap]) {
              return null;
            }

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;
            
            // Animazione per l'icona
            const scaleAnim = useRef(new Animated.Value(1)).current;

            useEffect(() => {
              Animated.spring(scaleAnim, {
                toValue: isFocused ? 1.2 : 1,
                useNativeDriver: true,
                friction: 4,
              }).start();
            }, [isFocused]);

            const onPress = async () => {
              console.log('CustomTabBar: Haptics.impactAsync called on tab press for route:', route.name);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
   
            const iconName = iconMap[route.name as keyof typeof iconMap];
            const color = isFocused ? activeTintColor : inactiveTintColor;
   
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <View style={[
                    styles.iconWrapper,
                    isFocused && { backgroundColor: `${activeTintColor}20` } // 12% opacità del colore attivo
                  ]}>
                    <MaterialIcons name={iconName} size={24} color={color} />
                  </View>
                </Animated.View>
                <Text style={[styles.label, { color, fontWeight: isFocused ? '700' : '500' }]}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  shadowContainer: {
    width: '100%',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: 'transparent', // Importante per l'ombra su iOS
  },
  blurContainer: {
    width: '100%',
    borderRadius: 35,
    overflow: 'hidden', // Fondamentale per ritagliare il contenuto sfocato
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Bordo sottile per effetto "vetro"
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 20,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
});
