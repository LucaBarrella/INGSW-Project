import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Import useRouter
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AgentPropertyCard } from "@/components/Agent/PropertyListing/AgentPropertyCard";
import ThemedButton from "@/components/ThemedButton";
import { PropertyDetail } from "@/components/Agent/PropertyDashboard/types"; // Importa il tipo unificato

// Dati mock conformi a PropertyDetail
const properties: PropertyDetail[] = [
  {
    id: 1, // ID numerico
    title: "Luxury Downtown Apartment",
    address: "123 Premium Street",
    price: 2500000, // Prezzo come numero
    imageUrl: "https://www.luxurychicagoapartments.com/wp-content/uploads/2023/03/DSC_5600-HDR-PRINT.jpg",
    type: "residential",
    views: 450,
    bookings: 30,
    status: "available",
    contractType: 'sale',
    area: 120,
    createdAt: new Date(2024, 2, 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2, // ID numerico
    title: "Modern Villa with Pool",
    address: "456 Luxury Avenue",
    price: 3800000, // Prezzo come numero
    imageUrl: "https://pictures.escapia.com/E2768/221984/4550040204.jpg",
    type: "residential",
    views: 200,
    bookings: 15,
    status: "available",
    contractType: 'sale',
    area: 180,
    createdAt: new Date(2024, 1, 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3, // ID numerico
    title: "City View Apartment",
    address: "789 Urban Street",
    price: 1200000, // Prezzo come numero
    imageUrl: "https://one11residences.com/wp-content/themes/one11/dist/images/living/penthouses-living.jpg",
    type: "residential",
    views: 600,
    bookings: 40,
    status: "rented",
    contractType: 'rent',
    area: 90,
    createdAt: new Date(2023, 10, 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Properties() {
  const router = useRouter(); // Initialize router

  const handlePropertyClick = (propertyId: number) => { // Accetta ID numerico
    // Handle property click
    console.log("Property clicked:", propertyId);
    // TODO: Navigare alla schermata di dettaglio dell'immobile per l'agente
  };

  const handleAddProperty = () => {
    // Navigate to the add property screen
    router.push('/add-property'); // Corrected route path without layout segments
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
                <AgentPropertyCard
                 key={property.id}
                 property={property}
                 onPress={() => handlePropertyClick(property.id)}
                 onEdit={() => console.log("Edit property:", property.id)}
                 onDelete={() => console.log("Delete property:", property.id)}
               />
              ))}
            </ThemedView>
            <SafeAreaView />
          </ScrollView>
      </ThemedView>
  );
}