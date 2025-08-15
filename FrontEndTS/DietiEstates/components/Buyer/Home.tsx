import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { CategoryButton } from "./CategoryButton";
import { LocationCard } from "./LocationCard";
import { TabBar } from "./TabBar";
import { Location, CategoryItem, TabItem } from "./types";
import { getFeaturedProperties } from "@/app/_services/api.service";
import ApiError from "@/app/_services/errors/ApiError";
import { PropertyDetail } from "@/components/Agent/PropertyDashboard/types";
import { useTranslation } from "react-i18next";

const categories: CategoryItem[] = [
  { icon: "home", title: "Casa", count: 5343 },
  { icon: "building", title: "Condominio", count: 3240 },
  { icon: "apartment", title: "Appartamento", count: 4214 },
  { icon: "villa", title: "Villa", count: 1890 },
];

const tabs: TabItem[] = [
  { icon: "⌂", label: "Home", onPress: () => {} },
  { icon: "♥", label: "Preferiti", onPress: () => {} },
  { icon: "☷", label: "Prenotazioni", onPress: () => {} },
  { icon: "◯", label: "Profilo", onPress: () => {} },
];

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [featuredProperties, setFeaturedProperties] = useState<PropertyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    // Implement search functionality
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const properties = await getFeaturedProperties();
        setFeaturedProperties(properties);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.userMessage);
        } else {
          setError("Si è verificato un errore inatteso durante il recupero delle proprietà.");
        }
        console.error("Errore nel recupero delle proprietà in evidenza:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">

        <ThemedView className="p-4">
          {categories.map((category) => (
            <CategoryButton
              key={category.title}
              icon={category.icon}
              label={category.title}
              onPress={() => {}}
            />
          ))}
        </ThemedView>

        <ThemedView className="p-4">
          <ThemedText className="text-xl font-semibold mb-4">
            Proprietà in Evidenza
          </ThemedText>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <ThemedText className="text-red-500 text-center">{error}</ThemedText>
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <LocationCard
                key={property.id}
                location={{
                  name: t('property_category.'+property.propertyCategory)+ " in " + property.address.city,
                  distance: 0, // Non abbiamo una distanza qui, potresti volerla calcolare o rimuovere
                  image: property.images?.[0] || "https://placehold.co/300x200",
                }}
                onPress={() => {}}
              />
            ))
          ) : (
            <ThemedText className="text-center">Nessuna proprietà in evidenza trovata.</ThemedText>
          )}
        </ThemedView>
      </ScrollView>

      <TabBar
        tabs={tabs.map((tab) => ({
          ...tab,
          onPress: () => setActiveTab(tab.label),
        }))}
        activeTab={activeTab}
      />
    </ThemedView>
  );
};

export default Home;
