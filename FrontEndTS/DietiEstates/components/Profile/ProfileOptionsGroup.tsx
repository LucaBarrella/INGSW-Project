import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileOptionRow, ProfileOptionRowProps } from './ProfileOptionRow';

interface ProfileOptionsGroupProps {
  options: Array<Omit<ProfileOptionRowProps, 'isFirst'>>; // isFirst sarà gestito internamente
}

export const ProfileOptionsGroup: React.FC<ProfileOptionsGroupProps> = ({ options }) => {
  const borderColor = useThemeColor({}, 'border');

  return (
    <ThemedView
      className="rounded-lg overflow-hidden" // Rimosso bg-white
      style={{ borderWidth: 1, borderColor }}
    >
      {options.map((option, index) => (
        <ProfileOptionRow
          key={option.id}
          id={option.id}
          title={option.title}
          icon={option.icon}
          onPress={option.onPress}
          isFirst={index === 0}
        />
      ))}
    </ThemedView>
  );
};