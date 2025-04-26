import React, { useState } from "react";
import { ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SearchHeader } from "./SearchHeader";
import { CategoryButton } from "./CategoryButton";
import { LocationCard } from "./LocationCard";
import { TabBar } from "./TabBar";
import { Location, CategoryItem, TabItem } from "./types";

const categories: CategoryItem[] = [
  { title: "Casa", count: 5343 },
  { title: "Condominio", count: 3240 },
  { title: "Appartamento", count: 4214 },
  { title: "Villa", count: 1890 },
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
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([
    {
      name: "Centro Storico",
      distance: 2.5,
      image: "https://placehold.co/300x200",
    },
    {
      name: "Porto Antico",
      distance: 4.8,
      image: "https://placehold.co/300x200",
    },
    {
      name: "Quartiere Universitario",
      distance: 1.2,
      image: "https://placehold.co/300x200",
    },
  ]);

  const handleSearch = () => {
    // Implement search functionality
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <ThemedView className="p-4">
          {categories.map((category) => (
            <CategoryButton
              key={category.title}
              title={category.title}
              count={category.count}
              onPress={() => {}}
            />
          ))}
        </ThemedView>

        <ThemedView className="p-4">
          <ThemedText className="text-xl font-semibold mb-4">
            Consigliati per Te
          </ThemedText>
          {nearbyLocations.map((location) => (
            <LocationCard
              key={location.name}
              location={location}
              onPress={() => {}}
            />
          ))}
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
