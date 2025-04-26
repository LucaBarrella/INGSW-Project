import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Location } from "./types";

interface LocationCardProps {
  location: Location;
  onPress: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm"
      accessibilityLabel={`${location.name} location card`}
    >
      <Image
        source={{ uri: location.image }}
        className="w-full h-48"
        accessibilityLabel={`Image of ${location.name}`}
      />
      <ThemedView className="p-4">
        <ThemedView className="flex-row justify-between items-center">
          <ThemedText className="text-lg font-semibold">
            {location.name}
          </ThemedText>
          <ThemedView className="flex-row items-center">
            <ThemedText className="mr-1">📍</ThemedText>
            <ThemedText>{location.distance} km</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};
