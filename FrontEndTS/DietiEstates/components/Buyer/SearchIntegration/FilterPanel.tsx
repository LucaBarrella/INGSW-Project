import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, Animated, Platform, StyleSheet, Modal, Easing, Dimensions, View, Switch } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { RangeSlider } from "./RangeSlider";
import { SegmentedControl } from "./SegmentedControl";
import { QuickNumericSelector } from "./QuickNumericSelector";
import { LabelInput } from "@/components/LabelInput";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withErrorBoundary } from "./ErrorBoundary";
import { useSearch } from "@/context/SearchContext";
import { ALL_FILTERS, CATEGORY_FILTERS } from "@/config/filter-config";
import { RESIDENTIAL_CATEGORIES, COMMERCIAL_CATEGORIES, GARAGE_CATEGORIES, LAND_CATEGORIES } from "./types"; //Dobbiamo creare GARAGE_CATEGORIES
import type { FilterDefinition } from "./types";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAndNavigate?: () => void;
}

const categoryStateToConfigMap: Record<string, string> = {
  residential: 'RESIDENTIAL',
  commercial: 'COMMERCIAL',
  industrial: 'COMMERCIAL', // 'industrial' frontend mapped to COMMERCIAL config (no separate INDUSTRIAL config)
  garage: 'GARAGE',
  land: 'LAND',
};

const FilterPanelComponent: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyAndNavigate }) => {
  const translateY = useRef(new Animated.Value(2000)).current;
  const [panelHeight, setPanelHeight] = useState(Dimensions.get('window').height * 0.8);
  const minHeight = Dimensions.get('window').height * 0.4;
  const maxHeight = Dimensions.get('window').height * 0.95;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const { state, dispatch } = useSearch();
  const { filters, selectedMainCategoryInPanel } = state;

  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const tabIconDefault = useThemeColor({}, "tabBarBackground");
  const backgroundPrimary = useThemeColor({}, "background");
  const loginCardBackground = useThemeColor({}, "loginCardBackground");
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

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
    ]).start(() => onClose());
  };

  const handleReset = (keepTransactionType = true) => {
    dispatch({ type: 'RESET_FILTERS', payload: { keepTransactionType } });
  };

  const selectCategory = (categoryKey: keyof typeof categoryStateToConfigMap | null) => {
    dispatch({ type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL', payload: categoryKey as any });
if (categoryKey) {
  // imposta category di default se necessario
  const defaultCat = (filters as any)[categoryKey]?.category ?? null;
  if (!defaultCat) {
    const defaultValue = (categoryKey === 'residential' && (filters as any).residential?.category)
      ? (filters as any).residential.category
      : null;
    if (defaultValue) {
      dispatch({
        type: 'UPDATE_FILTER',
        payload: { category: categoryKey as any, newFilters: { category: defaultValue as any } } as any
      });
    }
  }
}
  };

  const updateGeneralFilter = (newFilters: Record<string, any>) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { subCategory: 'general', newFilters } });
  };

  const updateCategoryFilter = (categoryKey: keyof typeof categoryStateToConfigMap, newFilters: Record<string, any>) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { category: categoryKey as any, newFilters } });
  };

  const renderControl = (def: FilterDefinition, currentCategoryKey?: keyof typeof categoryStateToConfigMap) => {
    const isGeneral = !currentCategoryKey;
    const value = isGeneral
      ? (filters.general as any)[def.key] ?? def.defaultValue
      : ((filters as any)[currentCategoryKey as string] ?? {})[def.key] ?? def.defaultValue;

    const onChange = (next: any) => {
      if (isGeneral) {
        updateGeneralFilter({ [def.key]: next });
      } else {
        updateCategoryFilter(currentCategoryKey as any, { [def.key]: next });
      }
    };

    switch (def.control) {
      case 'RangeSlider':
        return (
          <RangeSlider
            key={def.key}
            title={def.label}
            min={def.min ?? 0}
            max={def.max ?? 1000000}
            step={def.step ?? 1}
            value={value ?? { min: def.min ?? 0, max: def.max ?? 0 }}
            onChange={onChange}
            formatValue={(v) => (def.unit ? `${v}${def.unit}` : `${v}`)}
          />
        );
      case 'SegmentedControl':
        return (
          <View key={def.key} className="mb-4">
            <ThemedText className="text-sm mb-2" style={{ color: textColor }}>{def.label}</ThemedText>
            <SegmentedControl
              options={(def.options ?? []).map(o => ({ label: String(o), value: o }))}
              value={value}
              onChange={(v: any) => onChange(v)}
            />
          </View>
        );
      case 'Switch':
        return (
          <View key={def.key} className="flex-row justify-between items-center mb-4">
            <ThemedText style={{ color: textColor }}>{def.label}</ThemedText>
            <Switch
              value={!!value}
              onValueChange={(v) => onChange(v)}
            />
          </View>
        );
      case 'QuickNumericSelector':
        return (
          <QuickNumericSelector
            key={def.key}
            label={def.label}
            value={String(value ?? '')}
            onValueChange={(v: string) => onChange(v)}
            minValue={def.min}
            maxValue={def.max}
            unit={def.unit}
          />
        );
      case 'LabelInput':
      default:
        return (
          <LabelInput
            key={def.key}
            label={def.label}
            value={String(value ?? '')}
            onChangeText={(t: string) => onChange(t)}
          />
        );
    }
  };

  // determina le categorie disponibili dalla config
  const availableCategories = Object.keys(CATEGORY_FILTERS);

  const selectedCategoryConfigKey = selectedMainCategoryInPanel
    ? categoryStateToConfigMap[selectedMainCategoryInPanel as string]
    : null;

  const filtersToRender = selectedCategoryConfigKey
    ? (CATEGORY_FILTERS as any)[selectedCategoryConfigKey] ?? []
    : // se nessuna categoria selezionata, mostriamo filtri generali + sintesi categorie
      [];

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={hidePanel}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: overlayOpacity }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={hidePanel} activeOpacity={1} />
          <GestureDetector gesture={Gesture.Pan()
            .onUpdate((event) => {
              translateY.setValue(event.translationY);
            })
            .onEnd((event) => {
              let newHeight = panelHeight - event.translationY;
              newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
              setPanelHeight(newHeight);
              translateY.setValue(0);
            })
          }>
            <Animated.View style={[{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: panelHeight,
              backgroundColor: backgroundPrimary, borderTopLeftRadius: 30, borderTopRightRadius: 30,
              transform: [{ translateY }], ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 8 } })
            }]}>
              <ThemedView className="items-center pt-2 rounded-t-2xl" style={{ backgroundColor: tabIconDefault }}>
                <ThemedView className="w-12 h-1 rounded-full mb-2" style={{ backgroundColor: textColor }} />
              </ThemedView>

              <ThemedView className="flex-row justify-between items-center px-4 pb-4" style={{ backgroundColor: tabIconDefault }}>
                <ThemedView className="flex-row items-center" style={{ backgroundColor: tabIconDefault }}>
                  <Ionicons name="funnel" size={24} color={tintColor} />
                  <ThemedView className="ml-3" style={{ backgroundColor: tabIconDefault }}>
                    <ThemedText className="text-lg font-semibold" style={{ color: textColor }}>Filtri</ThemedText>
                    <ThemedText className="text-sm" style={{ color: textColor }}>
                      {selectedMainCategoryInPanel ? String(selectedMainCategoryInPanel) : "Seleziona una categoria"}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView className="flex-row items-center" style={{ backgroundColor: tabIconDefault }}>
                  <TouchableOpacity onPress={() => handleReset(true)} className="mr-4 py-2 px-3">
                    <ThemedText style={{ color: tintColor }}>Reset</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={hidePanel} className="p-1">
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ScrollView className="flex-1 p-4">
                <ThemedView className="mb-6">
                  {/* Filtri generali */}
                  <ThemedText className="text-lg font-semibold mb-4" style={{ color: textColor }}>Filtri Generali</ThemedText>
                  {renderControl(ALL_FILTERS.contract)}
                  {renderControl(ALL_FILTERS.priceRange)}
                  {renderControl(ALL_FILTERS.size)}
                  {renderControl(ALL_FILTERS.searchRadiusKm)}
                </ThemedView>

                {!selectedMainCategoryInPanel ? (
                  <ThemedView className="grid grid-cols-2 gap-4">
                    {availableCategories.map((catKey) => (
                      <TouchableOpacity
                        key={catKey}
                        onPress={() => {
                          // mappiamo la chiave config uppercase al corrispondente stato (reverse map)
                          const stateKey = Object.keys(categoryStateToConfigMap).find(k => categoryStateToConfigMap[k] === catKey);
                          selectCategory(stateKey as any);
                        }}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: loginCardBackground }}
                      >
                        <ThemedText className="font-medium" style={{ color: textColor }}>
                          {catKey}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                ) : (
                  <ThemedView>
                    <TouchableOpacity onPress={() => selectCategory(null)} className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg" style={{ backgroundColor: loginCardBackground }}>
                      <Ionicons name="swap-horizontal" size={20} color={tintColor} />
                      <ThemedText style={{ color: tintColor, marginLeft: 4 }}>Cambia Categoria</ThemedText>
                    </TouchableOpacity>
    
                    {/* Selettore sottocategoria (es. Appartamento, Loft, ...) */}
                    {(() => {
                      // Usa direttamente selectedMainCategoryInPanel (già 'residential'|'commercial'|'industrial'|'land')
                      const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                      // Debug: log stato corrente per investigare perché le opzioni non compaiono
                      // eslint-disable-next-line no-console
                      console.log('[FilterPanel] selectedMainCategoryInPanel:', selectedMainCategoryInPanel, 'selectedCategoryConfigKey:', selectedCategoryConfigKey, 'resolved stateKey:', stateKey);
                      if (!stateKey) return null;
    
                      const optionsMap: Record<string, string[]> = {
                        residential: RESIDENTIAL_CATEGORIES as unknown as string[],
                        commercial: COMMERCIAL_CATEGORIES as unknown as string[],
                        industrial: COMMERCIAL_CATEGORIES as unknown as string[], // industrial maps to commercial set
                        garage: GARAGE_CATEGORIES as unknown as string[],
                        land: LAND_CATEGORIES as unknown as string[],
                      };
    
                      const opts = optionsMap[stateKey] || [];
                      // Debug: log opzioni trovate
                      // eslint-disable-next-line no-console
                      console.log('[FilterPanel] category options for', stateKey, opts);
                      if (opts.length === 0) return null;
    
                      const currentValue = ((filters as any)[stateKey] || {}).category;
    
                      return (
                        <ThemedView className="mb-4">
                          <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
                            Tipo ({String(stateKey)})
                          </ThemedText>
                          <SegmentedControl
                            options={opts.map(o => ({ label: String(o), value: o }))}
                            value={currentValue}
                            onChange={(v: any) => {
                              // aggiorna la proprietà 'category' della categoria selezionata
                              updateCategoryFilter(stateKey as any, { category: v });
                            }}
                          />
                        </ThemedView>
                      );
                    })()}
    
                    {/* Render dinamico dei filtri per la categoria selezionata */}
                    {filtersToRender.map((key: string) => {
                      const def: FilterDefinition = (ALL_FILTERS as any)[key];
                      if (!def) return null;
                      // Per i controlli della categoria passiamo la chiave di stato direttamente
                      const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                      return renderControl(def, stateKey);
                    })}
                  </ThemedView>
                )}
              </ScrollView>

              <ThemedView className="px-4 pt-4 pb-8 border-t border-gray-200 dark:border-gray-700" style={{ backgroundColor: backgroundPrimary }}>
                <TouchableOpacity
                  onPress={() => {
                    hidePanel();
                    if (onApplyAndNavigate) onApplyAndNavigate();
                  }}
                  className="p-4 rounded-lg items-center flex-row justify-center"
                  style={{ backgroundColor: buttonBackground }}
                >
                  <Ionicons name="search" size={20} color={buttonTextColor} style={{ marginRight: 8 }} />
                  <ThemedText className="text-white font-semibold" style={{ color: buttonTextColor }}>Cerca</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export const FilterPanel = withErrorBoundary(FilterPanelComponent, {
  onError: (error, errorInfo) => {
    console.error("FilterPanel Error:", error, errorInfo);
  },
  fallbackComponent: (
    <ThemedView className="p-4">
      <ThemedText className="text-red-500">Errore nel caricamento dei filtri. Riprova più tardi.</ThemedText>
    </ThemedView>
  ),
});
