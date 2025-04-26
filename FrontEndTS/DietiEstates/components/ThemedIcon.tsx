import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ThemedIconProps {
  icon: string;
  size?: number;
  lightColor?: string;
  darkColor?: string;
  accessibilityLabel: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
  icon,
  size = 24,
  lightColor,
  darkColor,
  accessibilityLabel,
  className,
  style
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'iconColor');

  return (
    <Iconify
      icon={icon}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
      className={className}
      style={style}
    />
  );
};
