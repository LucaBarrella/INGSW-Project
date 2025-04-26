import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { PropertyCard } from "@/components/Agent/PropertyListing/PropertyCard";
import ThemedButton from "@/components/ThemedButton";
import { Property } from "@/components/Agent/PropertyListing/types";

const properties: Property[] = [
  {
    id: "1",
    title: "Luxury Downtown Apartment",
    address: "123 Premium Street",
    price: 2500000,
    imageUrl:
      "https://www.luxurychicagoapartments.com/wp-content/uploads/2023/03/DSC_5600-HDR-PRINT.jpg",
  },
  {
    id: "2",
    title: "Modern Villa with Pool",
    address: "456 Luxury Avenue",
    price: 3800000,
    imageUrl: "https://pictures.escapia.com/E2768/221984/4550040204.jpg",
  },
  {
    id: "3",
    title: "City View Apartment",
    address: "789 Urban Street",
    price: 1200000,
    imageUrl:
      "https://one11residences.com/wp-content/themes/one11/dist/images/living/penthouses-living.jpg",
  },
];

export default function Properties() {
  const handlePropertyClick = (propertyId: string) => {
    // Handle property click
  };

  const handleAddProperty = () => {
    // Handle add property
  };

  return (
      <ThemedView className="flex-1">
          <ScrollView contentContainerStyle={{}} className="flex-grow p-6 pb-20">
            <ThemedView className="flex-row justify-between items-center mb-10">
              <ThemedText type="title" className="text-2xl leading-none">
                Immobili
              </ThemedText>
              <ThemedButton
                title="Aggiungi immobile"
                onPress={handleAddProperty}
                borderRadius={10}
                className="px-4 py-2 rounded-md mb-0"
              />
            </ThemedView>
            <ThemedView className="flex flex-col gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onPress={() => handlePropertyClick(property.id)}
                />
              ))}
            </ThemedView>
            <SafeAreaView />
          </ScrollView>
      </ThemedView>
  );
}