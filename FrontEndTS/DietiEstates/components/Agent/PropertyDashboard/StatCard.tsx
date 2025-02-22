import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface ThemeColors {
  light?: string;
  dark?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  colors?: ThemeColors;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value,
  colors = {}
}) => {
  return (
    <ThemedView 
      className="flex flex-col gap-2 p-6 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
      style={{ 
        backgroundColor: useThemeColor(colors, 'propertyCardBackground')
      }}
    >
      <ThemedText 
        className="text-sm" 
        style={{ 
          color: useThemeColor(colors, 'propertyCardDetail'),
          opacity: 0.8
        }}
      >
        {title}
      </ThemedText>
      <ThemedText 
        className="text-3xl font-bold"
        style={{ 
          color: useThemeColor(colors, 'text')
        }}
      >
        {value}
      </ThemedText>
    </ThemedView>
  );
};
