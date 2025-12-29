import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';

interface CustomToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * CustomToggle component for a modern, high-contrast switch.
 * Perfectly emulates macOS proportions and alignment.
 */
export const CustomToggle: React.FC<CustomToggleProps> = ({ value, onValueChange }) => {
  const tintColor = "#007AFF"; // macOS Blue
  const backgroundMuted = useThemeColor({ light: '#D1D1D6', dark: '#39393D' }, "backgroundMuted");
  const white = "#FFFFFF";
  
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const toggleHandle = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onValueChange(!value);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Precise translation for 44px width and 20px circle
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundMuted, tintColor],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={toggleHandle}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Animated.View 
          style={[
            styles.circle, 
            { 
              transform: [{ translateX }],
              backgroundColor: white,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.5,
              elevation: 2,
            }
          ]} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    // Padding removed to handle centering exclusively via translateX
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});