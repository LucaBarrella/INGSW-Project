import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AgentPropertyCard } from "@/components/Agent/PropertyListing/AgentPropertyCard";
import ThemedButton from "@/components/ThemedButton";
import { PropertyDetail } from "@/components/Agent/PropertyDashboard/types"; // Importa il tipo unificato
import { t } from "i18next";
import httpClient from "@/src/core/httpClient";

export default function Properties() {
  const router = useRouter(); // Initialize router
  const [properties, setProperties] = useState<PropertyDetail[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await httpClient.get('/api/properties/agent_properties/');
        setProperties(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle proprietà:', error);
      }
    };

    fetchProperties();
  }, []);

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
                title={t('addProperty')}
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
              {properties.length === 0 && (
                <ThemedText className="text-center text-gray-500 mt-8">
                  {t('noPropertiesFound')}
                </ThemedText>
              )}
            </ThemedView>
          <SafeAreaView />
        </ScrollView>
    </ThemedView>
  );
}