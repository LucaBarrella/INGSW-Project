import React, { useEffect, useRef } from "react";
import { ScrollView, TouchableOpacity, Animated, Platform, StyleSheet, Modal, Easing, Dimensions, View, Switch, Alert } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { RangeSlider } from "./RangeSlider";
import { PriceInput } from "./PriceInput";
import { SegmentedControl } from "./SegmentedControl";
import { QuickNumericSelector } from "./QuickNumericSelector";
import { LabelInput } from "@/components/LabelInput";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withErrorBoundary } from "./ErrorBoundary";
import { useSearch } from "@/context/SearchContext";
import useSearchProperties from '@/src/hooks/useSearchProperties';
import useSearchUrlState from '@/src/hooks/useSearchUrlState';
import { ALL_FILTERS, CATEGORY_FILTERS } from "@/config/filter-config";
import usePropertyCategories from '@/src/hooks/usePropertyCategories'; // dinamico: scarica categorie/sottocategorie dal backend
import type { FilterDefinition } from "./types";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAndNavigate?: () => void;
}

const categoryStateToConfigMap: Record<string, string> = {
  residential: 'RESIDENTIAL',
  commercial: 'COMMERCIAL',
  garage: 'GARAGE',
  land: 'LAND',
};

const FilterPanelComponent: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyAndNavigate }) => {
  const translateY = useRef(new Animated.Value(2000)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const { state } = useSearch();
  const { filters, selectedMainCategoryInPanel } = state;
  // Usa l'hook che espone updateFilter/resetFilters/search con logica di sanitizzazione
  const { updateFilter, resetFilters, search, selectMainCategory } = useSearchProperties();
  // Hook che scarica dinamicamente le categorie/sottocategorie dal backend
  const { categoriesByType, isLoading: categoriesLoading, refresh: refreshCategories } = usePropertyCategories();
  // Hook per sincronizzare esplicitamente Context -> URL quando l'utente applica i filtri
  const { forceSyncUrl } = useSearchUrlState();

  const panelHeight = Dimensions.get('window').height * 0.8;
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
    // Usa l'hook per mantenere la logica centralizzata
    resetFilters(keepTransactionType);
  };

  /* selectCategory rimosso dal componente.
     Ora si utilizza selectMainCategory fornito da useSearchProperties()
     che centralizza dispatch e updateFilter necessari. */

  const updateGeneralFilter = (newFilters: Record<string, any>) => {
    // instrada verso l'hook che normalizza null/undefined e dispatcha
    updateFilter('general', newFilters as any);
  };

  const updateCategoryFilter = (categoryKey: keyof typeof categoryStateToConfigMap, newFilters: Record<string, any>) => {
    // instrada verso l'hook per aggiornamenti delle categorie
    updateFilter(categoryKey as any, newFilters as any);
  };

  const renderControl = (def: FilterDefinition, currentCategoryKey?: keyof typeof categoryStateToConfigMap) => {
    console.log(`[FilterPanel] renderControl - def.key: ${def.key}, currentCategoryKey: ${currentCategoryKey}`);
    const isGeneral = !currentCategoryKey;

    // Recupera il FilterState e poi il suo valore; fallback su def.defaultValue
    const rawState = isGeneral
      ? (filters.general as any)[def.key]
      : ((filters as any)[currentCategoryKey as string] ?? {})[def.key];

    // Unwrap ricorsivo: gestisce casi in cui il valore è avvolto in più livelli
    // di { value } (es. legacy o payload malformati). Restituisce il valore primitivo
    // se possibile, oppure l'oggetto non primitive più interno.
    const unwrapValue = (v: any): any => {
      if (v === undefined) return undefined;
      if (v === null) return null;
      if (typeof v !== 'object') return v;
      if ('value' in v) return unwrapValue((v as any).value);
      return v;
    };

    const unwrapped = unwrapValue(rawState);
    // Assicuriamoci di srotolare anche il default configurato se per errore è un wrapper
    const defaultUnwrapped = unwrapValue(def.defaultValue);
    const value = unwrapped !== undefined ? unwrapped : (defaultUnwrapped !== undefined ? defaultUnwrapped : def.defaultValue);

    const onChange = (next: any) => {
      if (isGeneral) {
        updateGeneralFilter({ [def.key]: next });
      } else {
        updateCategoryFilter(currentCategoryKey as any, { [def.key]: next });
      }
    };

    switch (def.control) {
      case 'RangeSlider':
        if (def.key === 'priceRange') {
          return (
            <PriceInput
              key={def.key}
              label="Prezzo massimo"
              value={value.max ?? 0}
              onChange={(newMax) => onChange({ min: 0, max: newMax })}
              quickOptions={[100000, 200000, 300000]}
            />
          );
        }
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
            type={def.key === 'size' ? 'size' : 'price'}
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
            // UI component expects una stringa: srotoliamo profondamente eventuali wrapper
            value={(() => {
              try {
                const display = unwrapValue(value);
                if (display === null || display === undefined) return '';
                // se è già primitivo
                if (typeof display === 'number' || typeof display === 'string') return String(display);
                // se è oggetto, cerchiamo proprietà numeriche comuni come value/defaultValue/min/max
                if (typeof display === 'object') {
                  const probe = (o: any): number | undefined => {
                    if (o == null) return undefined;
                    if (typeof o === 'number') return o;
                    if (typeof o === 'string' && o.trim() !== '' && !Number.isNaN(Number(o))) return Number(o);
                    const keys = ['value','defaultValue','min','max','minNumberOfFloors','minNumberOfRooms','minNumberOfBathrooms','floor'];
                    for (const k of keys) {
                      if (k in o) {
                        const v = probe(o[k]);
                        if (v !== undefined) return v;
                      }
                    }
                    // ultima risorsa: cerca la prima proprietà numerica
                    for (const k of Object.keys(o)) {
                      const v = o[k];
                      if (typeof v === 'number' && Number.isFinite(v)) return v;
                      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
                    }
                    return undefined;
                  };
                  const found = probe(display);
                  return found === undefined ? '' : String(found);
                }
                return '';
              } catch (e) {
                console.error('[FilterPanel] QuickNumericSelector value serialization error', e);
                return '';
              }
            })()}
            onValueChange={(v: string) => {
              // Convertiamo stringa in numero se possibile, altrimenti inviamo null per il reset
              const parsed = v === null || v === '' ? null : Number(v);
              onChange(parsed);
            }}
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
                <TouchableOpacity onPress={() => handleReset(false)} className="mr-4 py-2 px-3">
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
                {renderControl(ALL_FILTERS.acceptedCondition)}
                {renderControl(ALL_FILTERS.minEnergyRating)}
                {renderControl(ALL_FILTERS.minYearBuilt)}
              </ThemedView>

              {!selectedMainCategoryInPanel ? (
                <ThemedView className="grid grid-cols-2 gap-4">
                  {availableCategories.map((catKey) => {
                    // mappiamo la chiave config uppercase al corrispondente stato (reverse map)
                    const stateKey = Object.keys(categoryStateToConfigMap).find(k => categoryStateToConfigMap[k] === catKey) as keyof typeof categoryStateToConfigMap | undefined;
                    const isSelected = stateKey ? selectedMainCategoryInPanel === stateKey : false;
                    return (
                      <TouchableOpacity
                        key={catKey}
                        onPress={() => selectMainCategory(stateKey as any)}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: isSelected ? tintColor : loginCardBackground }}
                      >
                        <ThemedText className="font-medium" style={{ color: isSelected ? '#fff' : textColor }}>
                          {catKey}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </ThemedView>
              ) : (
                <ThemedView>
                  <TouchableOpacity onPress={() => selectMainCategory(null)} className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg" style={{ backgroundColor: loginCardBackground }}>
                    <Ionicons name="swap-horizontal" size={20} color={tintColor} />
                    <ThemedText style={{ color: tintColor, marginLeft: 4 }}>Cambia Categoria</ThemedText>
                  </TouchableOpacity>
  
                  {/* Selettore sottocategoria (es. Appartamento, Loft, ...) */}
                  {(() => {
                    // Usa direttamente selectedMainCategoryInPanel (già 'residential'|'commercial'|'garage'|'land')
                    const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                    // Debug: log stato corrente per investigare perché le opzioni non compaiono
                    // eslint-disable-next-line no-console
                    console.log('[FilterPanel] selectedMainCategoryInPanel:', selectedMainCategoryInPanel, 'selectedCategoryConfigKey:', selectedCategoryConfigKey, 'resolved stateKey:', stateKey);
                    if (!stateKey) return null;
  
                    // Otteniamo le opzioni dinamiche dal backend via hook.
                    // categoryStateToConfigMap mappa lo stato 'residential'|'commercial' -> 'RESIDENTIAL'|'COMMERCIAL'
                    const configKey = categoryStateToConfigMap[stateKey as string];
                    const opts = (configKey && categoriesByType && Array.isArray(categoriesByType[configKey]) && categoriesByType[configKey].length > 0)
                      ? categoriesByType[configKey]
                      : [];
                    // Debug: log opzioni trovate
                    // eslint-disable-next-line no-console
                    console.log('[FilterPanel] category options for', stateKey, opts);
                    if (opts.length === 0) return null;
  
                    // Il filtro category è un FilterState<...>; usiamo .value per il controllo UI
                    const rawCategoryState = ((filters as any)[stateKey] || {}).category;
                    const currentValue = rawCategoryState && typeof rawCategoryState === 'object' && 'value' in rawCategoryState
                      ? rawCategoryState.value
                      : (rawCategoryState ?? undefined);

                    return (
                      <ThemedView className="mb-4">
                        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
                          Tipo ({String(stateKey)})
                        </ThemedText>
                        <SegmentedControl
                          options={opts.map(o => ({ label: String(o), value: o }))}
                          value={currentValue}
                          onChange={(v: any) => {
                            console.log(`[FilterPanel] onChange subcategory - stateKey: ${stateKey}, selected value:`, v);
                            // aggiorna la proprietà 'category' della categoria selezionata usando l'hook (normalizza valori)
                            updateCategoryFilter(stateKey as any, { category: v });
                          }}
                        />
                      </ThemedView>
                    );
                  })()}
  
                  {/* Render dinamico dei filtri per la categoria selezionata */}
                  {filtersToRender.map((key: string) => {
                    const def: FilterDefinition = (ALL_FILTERS as any)[key];
                    if (!def) {
                      console.warn(`[FilterPanel] No filter definition found for key: ${key}`);
                      return null;
                    }
                    // Per i controlli della categoria passiamo la chiave di stato direttamente
                    const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                    return renderControl(def, stateKey);
                  })}
                </ThemedView>
              )}
            </ScrollView>

            <ThemedView className="px-4 pt-4 pb-8 border-t border-gray-200 dark:border-gray-700" style={{ backgroundColor: backgroundPrimary }}>
              <TouchableOpacity
                onPress={async () => {
                  hidePanel();
                  try {
                    // Esegui la ricerca direttamente dall'hook (disaccoppia da URL)
                    await search();
                    // Sincronizza l'URL solo dopo che la ricerca è stata effettivamente applicata
                    try { forceSyncUrl(); } catch (e) { console.error('[FilterPanel] forceSyncUrl failed', e); }
                    // Se il chiamante vuole anche navigare/aggiornare la UI, invoca la callback
                    if (onApplyAndNavigate) onApplyAndNavigate();
                  } catch (err) {
                    Alert.alert('Errore', 'Si è verificato un errore durante la ricerca. Riprova.');
                    // eslint-disable-next-line no-console
                    console.error('[FilterPanel] search failed', err);
                  }
                }}
                className="p-4 rounded-lg items-center flex-row justify-center"
                style={{ backgroundColor: buttonBackground }}
              >
                <Ionicons name="search" size={20} color={buttonTextColor} style={{ marginRight: 8 }} />
                <ThemedText className="text-white font-semibold" style={{ color: buttonTextColor }}>Cerca</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </Animated.View>
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
