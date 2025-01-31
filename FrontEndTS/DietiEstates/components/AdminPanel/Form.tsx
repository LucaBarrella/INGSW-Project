import React from "react";
import { FormProps } from "./types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export const Form: React.FC<FormProps> = ({ title, onSubmit, children }) => {
  return (
    <ThemedView className="flex flex-col gap-4 p-6 rounded-xl bg-[white] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <ThemedText className="text-xl font-semibold">{title}</ThemedText>
      {children}
    </ThemedView>
  );
};
