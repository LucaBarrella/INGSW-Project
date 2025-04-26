import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TabItem } from "./types";

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab }) => {
  return (
    <ThemedView className="flex-row justify-around items-center bg-white py-2 border-t border-gray-200">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          onPress={tab.onPress}
          className="items-center px-4 py-2"
          accessibilityLabel={`${tab.label} tab`}
          accessibilityState={{ selected: activeTab === tab.label }}
        >
          <ThemedText className="text-2xl">{tab.icon}</ThemedText>
          <ThemedText className="text-sm mt-1">{tab.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
};
