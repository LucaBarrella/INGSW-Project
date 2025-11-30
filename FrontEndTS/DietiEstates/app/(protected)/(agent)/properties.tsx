import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AgentPropertyCard } from "@/components/Agent/PropertyListing/AgentPropertyCard";
import ThemedButton from "@/components/ThemedButton";
import { PropertyDTO } from '@/components/Agent/PropertyDashboard/types';
import { t } from "i18next";
import httpClient from "@/src/core/httpClient";

export default function Properties() {
  const router = useRouter(); // Initialize router
  const [properties, setProperties] = useState<PropertyDTO[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await httpClient.get('/api/properties/agent_properties/');
        setProperties(response.data.content);
      } catch (error) {
        console.error('Errore nel recupero delle proprietà:', error);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (propertyId: number) => {
    router.push({
      pathname: '/(protected)/(buyer)/property-detail',
      params: { propertyId: propertyId.toString() },
    });
  };

  const handleAddProperty = () => {
    router.push('/add-property');
  };

  if (!properties) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{t('loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
      <ThemedView className="flex-1">
          <ScrollView contentContainerStyle={{}} className="flex-grow p-6 pb-20">
            <ThemedView className="flex-row justify-between items-center mb-10">
              <ThemedText type="title" className="text-2xl leading-none">
                {t('yourProperties')}
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