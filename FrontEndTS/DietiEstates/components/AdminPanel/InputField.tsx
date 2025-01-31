import React from "react";
import { TextInput, Text } from "react-native";
import { InputFieldProps } from "./types";
import { ThemedView } from "@/components/ThemedView";

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <ThemedView className="flex flex-col gap-1">
      <ThemedView>
        <Text className="text-sm font-medium text-black">{label}</Text>
      </ThemedView>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={placeholder}
        id={id}
        value={value || ""}
        onChangeText={onChange}
        placeholder={placeholder}
        className="p-3 rounded-lg border border-solid border-zinc-300"
      />
    </ThemedView>
  );
};
