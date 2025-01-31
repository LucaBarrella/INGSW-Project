import React from "react";
import { TouchableOpacity } from "react-native";
import { ActionButtonProps } from "./types";
import { ThemedText } from "@/components/ThemedText";

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className="px-6 py-3 rounded-lg"
      style={{
        backgroundColor: isSelected ? "#064789" : "#ebf2fa",
      }}
      onPress={onPress}
    >
      <ThemedText
        style={{
          color: isSelected ? "white" : "#064789",
        }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};
