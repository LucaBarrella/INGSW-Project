import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TabHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function TabHeader({ title, subtitle, className = '' }: TabHeaderProps) {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  return (
    <ThemedView 
      className={`w-full px-6 pt-6 pb-4 border-b ${className}`}
      style={{ 
        backgroundColor: background,
        borderBottomColor: `${text}20` // Using text color with 20% opacity for border
      }}
    >
      <ThemedText 
        className="text-2xl font-bold mb-1"
        style={{ color: text }}
      >
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText 
          className="text-base opacity-70"
          style={{ color: text }}
        >
          {subtitle}
        </ThemedText>
      )}
    </ThemedView>
  );
}
