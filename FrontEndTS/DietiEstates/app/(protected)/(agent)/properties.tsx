import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6 pb-20">
        <ThemedView className="flex-1">
          {properties.length > 0 ? (
            <View className="flex flex-col gap-8">
              {properties.map((property) => (
                <AgentPropertyCard
                  key={property.id}
                  property={property}
                  onPress={() => handlePropertyClick(property.id)}
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="home-outline" size={80} color="#6b7280" />
              <ThemedText className="text-center text-gray-500 mt-4 text-lg font-medium">
                {t('noPropertiesFound')}
              </ThemedText>
              <ThemedText className="text-center text-gray-400 mt-2 px-10">
                {t('noPropertiesFoundDescription')}
              </ThemedText>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}