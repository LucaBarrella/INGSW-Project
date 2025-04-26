import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, Animated, Platform, StyleSheet, Modal, Easing, Dimensions } from "react-native";
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { RangeSlider } from "./RangeSlider";
import { CategorySpecificFilters } from "./CategorySpecificFilters";
import { 
  PropertyFilters, 
  Categories, 
  DEFAULT_PRICE_RANGES,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  INDUSTRIAL_CATEGORIES,
  LAND_CATEGORIES
} from "./types";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withErrorBoundary } from "./ErrorBoundary";
import { SegmentedControl } from "./SegmentedControl";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  categories: Categories;
  selectedMainCategory: string;
  onSelectMainCategory: (category: string) => void;
  onUpdateFilters: (filters: PropertyFilters) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const FilterPanelComponent: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  categories,
  selectedMainCategory,
  onSelectMainCategory,
  onUpdateFilters,
  onResetFilters,
  onApplyFilters,
}) => {
  const translateY = useRef(new Animated.Value(2000)).current;
  const [panelHeight, setPanelHeight] = useState(Dimensions.get('window').height * 0.8);
  const minHeight = Dimensions.get('window').height * 0.4;
  const maxHeight = Dimensions.get('window').height * 0.95;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const backgroundPrimary = useThemeColor({}, "propertyCardBackground");
  const loginCardBackground = useThemeColor({}, "loginCardBackground");
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");

  const showPanel = () => {
    translateY.setValue(2000);
    overlayOpacity.setValue(0);
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hidePanel = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 2000,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (isOpen) {
      showPanel();
    }
  }, [isOpen]);

  const currentPriceRange = DEFAULT_PRICE_RANGES[filters.general.transactionType];

  const handleReset = () => {
    onResetFilters();
    onUpdateFilters(filters);
  };

  const getDefaultCategoryValue = (category: string) => {
    switch (category.toLowerCase()) {
      case 'residential':
        return RESIDENTIAL_CATEGORIES[0];
      case 'commercial':
        return COMMERCIAL_CATEGORIES[0];
      case 'industrial':
        return INDUSTRIAL_CATEGORIES[0];
      case 'land':
        return LAND_CATEGORIES[0];
      default:
        return '';
    }
  };

  const handleBackToCategories = () => {
    onSelectMainCategory("");
  };

  const handleSelectCategory = (category: string) => {
    // Set default category value when switching categories
    const defaultCategory = getDefaultCategoryValue(category);
    const updatedFilters = {
      ...filters,
      [category.toLowerCase()]: {
        ...filters[category.toLowerCase() as keyof PropertyFilters],
        category: defaultCategory
      }
    };
    onUpdateFilters(updatedFilters);
    onSelectMainCategory(category);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={hidePanel}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: overlayOpacity,
            },
          ]}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={hidePanel}
            activeOpacity={1}
          />
          <PanGestureHandler
            onGestureEvent={Animated.event(
              [{ nativeEvent: { translationY: translateY } }],
              { useNativeDriver: true }
            )}
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.oldState === State.ACTIVE) {
                let newHeight = panelHeight - event.nativeEvent.translationY;
                newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
                setPanelHeight(newHeight);
                translateY.setValue(0);
              }
            }}
          >
            <Animated.View
              style={[{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: panelHeight,
                backgroundColor: backgroundPrimary,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                transform: [{ translateY }],
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 8,
                  },
                }),
              }]}
            >
              <ThemedView className="items-center pt-2 rounded-t-2xl">
                <ThemedView 
                  className="w-12 h-1 rounded-full mb-2"
                  style={{ backgroundColor: tabIconDefault }}
                />
              </ThemedView>
              
              <ThemedView
                className="flex-row justify-between items-center px-4 pb-4 border-b border-gray-200 dark:border-gray-700"
              >
                <ThemedView className="flex-row items-center">
                  <Ionicons name="funnel" size={24} color={tintColor} />
                  <ThemedView className="ml-3">
                    <ThemedText
                      className="text-lg font-semibold"
                      style={{ color: textColor }}
                    >
                      Filtri
                    </ThemedText>
                    <ThemedText
                      className="text-sm"
                      style={{ color: tabIconDefault }}
                    >
                      {selectedMainCategory
                        ? categories[selectedMainCategory.toLowerCase()]?.name ?? selectedMainCategory
                        : "Seleziona una categoria"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={handleReset} 
                    className="mr-4 py-2 px-3"
                  >
                    <ThemedText style={{ color: tintColor }}>Reset</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={hidePanel}
                    className="p-1"
                  >
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ScrollView className="flex-1 p-4">
                <ThemedView className="mb-6">
                  <ThemedText
                    className="text-lg font-semibold mb-4"
                    style={{ color: textColor }}
                  >
                    Filtri Generali
                  </ThemedText>

                  <ThemedView className="mb-4">
                    <ThemedText 
                      className="text-sm mb-2" 
                      style={{ color: textColor }}
                    >
                      Tipo di Transazione
                    </ThemedText>
                    <SegmentedControl
                      options={[
                        { label: "Affitto", value: "rent" },
                        { label: "Vendita", value: "sale" }
                      ]}
                      value={filters.general.transactionType}
                      onChange={(value) =>
                        onUpdateFilters({
                          ...filters,
                          general: { 
                            ...filters.general, 
                            transactionType: value as "rent" | "sale",
                            priceRange: DEFAULT_PRICE_RANGES[value as "rent" | "sale"].defaultRange
                          },
                        })
                      }
                    />
                  </ThemedView>

                  <RangeSlider
                    title={`Prezzo ${filters.general.transactionType === "rent" ? "Mensile" : "Massimo"}`}
                    min={currentPriceRange.min}
                    max={currentPriceRange.max}
                    step={currentPriceRange.step}
                    value={filters.general.priceRange}
                    onChange={(value) =>
                      onUpdateFilters({
                        ...filters,
                        general: { ...filters.general, priceRange: value },
                      })
                    }
                    formatValue={(value) => 
                      `€${value.toLocaleString('it-IT')}`
                    }
                  />

                  <RangeSlider
                    title="Dimensione"
                    min={20}
                    max={1000}
                    step={10}
                    value={filters.general.size}
                    onChange={(value) =>
                      onUpdateFilters({
                        ...filters,
                        general: { ...filters.general, size: value },
                      })
                    }
                    formatValue={(value) => `${value}m²`}
                  />
                </ThemedView>

                {!selectedMainCategory ? (
                  <ThemedView className="grid grid-cols-2 gap-4">
                    {Object.entries(categories).map(([key, category]) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleSelectCategory(key)}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: loginCardBackground }}
                      >
                        <ThemedText
                          className="font-medium"
                          style={{ color: textColor }}
                        >
                          {category.name}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                ) : (
                  <CategorySpecificFilters
                    category={selectedMainCategory}
                    filters={filters}
                    onUpdateFilters={onUpdateFilters}
                    onBackToCategories={handleBackToCategories}
                  />
                )}
              </ScrollView>

              <ThemedView 
                className="px-4 pt-4 pb-8 border-t border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: backgroundPrimary }}
              >
                <TouchableOpacity 
                  onPress={() => {
                    onApplyFilters();
                    hidePanel();
                  }}
                  className="p-4 rounded-lg items-center flex-row justify-center"
                  style={{ backgroundColor: buttonBackground }}
                >
                  <Ionicons name="search" size={20} color={buttonTextColor} style={{ marginRight: 8 }} />
                  <ThemedText 
                    className="text-white font-semibold"
                    style={{ color: buttonTextColor }}
                  >
                    Cerca
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export const FilterPanel = withErrorBoundary<FilterPanelProps>(FilterPanelComponent, {
  onError: (error, errorInfo) => {
    console.error("FilterPanel Error:", error, errorInfo);
  },
  fallbackComponent: (
    <ThemedView className="p-4">
      <ThemedText className="text-red-500">
        Errore nel caricamento dei filtri. Riprova più tardi.
      </ThemedText>
    </ThemedView>
  ),
});
