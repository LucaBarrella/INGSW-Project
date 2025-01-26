import React from 'react';
import { Text, type TextProps } from 'react-native';
import clsx from 'clsx';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'description';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  className,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[{ color }, style]}
      className={clsx(
        type === 'default' && 'text-base leading-6',
        type === 'title' && 'text-4xl font-bold leading-8',
        type === 'defaultSemiBold' && 'text-base leading-6 font-semibold',
        type === 'subtitle' && 'text-xl font-bold',
        type === 'link' && 'text-base leading-7 text-blue-600',
        type === 'description' && 'text-xs leading-5 text-white opacity-80',
        className
      )}
      {...rest}
    />
  );
}