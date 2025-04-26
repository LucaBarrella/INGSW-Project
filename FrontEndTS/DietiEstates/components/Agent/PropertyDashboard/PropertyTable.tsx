import React, { useState } from "react";
import { FlatList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { PropertyDetail } from "./types";
import { PropertyRow } from "./PropertyRow";
import { SafeAreaView } from "react-native-safe-area-context";

const PropertySeparator = () => <ThemedView className="h-5" />;

interface PropertyTableProps {
  propertyDetails: PropertyDetail[];
  ListHeaderComponent?: React.ReactElement;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  propertyDetails,
  ListHeaderComponent,
}) => {
  const [pinnedProperties, setPinnedProperties] = useState<number[]>([]);

  const togglePin = (propertyId: number) => {
    setPinnedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: 100, // Altezza approssimativa di ogni riga
      offset: 100 * index + (index > 0 ? 20 * (index - 1) : 0), // Considera il separator
      index,
    }),
    []
  );

  const renderPropertyRow = React.useCallback(
    ({ item }: { item: PropertyDetail }) => (
      <PropertyRow
        property={item}
        isPinned={pinnedProperties.includes(item.id)}
        onTogglePin={() => togglePin(item.id)}
      />
    ),
    [pinnedProperties, togglePin]
  );

  // Sort properties to show pinned items first
  const sortedProperties = React.useMemo(() => {
    return [...propertyDetails].sort((a, b) => {
      if (pinnedProperties.includes(a.id) && !pinnedProperties.includes(b.id)) return -1;
      if (!pinnedProperties.includes(a.id) && pinnedProperties.includes(b.id)) return 1;
      return 0;
    });
  }, [propertyDetails, pinnedProperties]);

  return (
    <ThemedView className="flex-1 mb-4">
        <FlatList
          data={sortedProperties}
          renderItem={renderPropertyRow}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={PropertySeparator}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          initialNumToRender={7}
          onEndReachedThreshold={0.5}
          getItemLayout={getItemLayout}
        />
    </ThemedView>
  );
};
