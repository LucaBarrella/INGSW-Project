import React, { useEffect, useRef } from "react";
import { ScrollView, TouchableOpacity, Animated, Platform, StyleSheet, Modal, Easing, Dimensions, View, Alert } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { RangeSlider } from "./RangeSlider";
import { PriceInput } from "./PriceInput";
import { SegmentedControl } from "./SegmentedControl";
import { ChipSelector } from "./ChipSelector";
import { QuickNumericSelector } from "./QuickNumericSelector";
import { CustomToggle } from "./CustomToggle";
import { LabelInput } from "@/components/LabelInput";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withErrorBoundary } from "./ErrorBoundary";
import { useSearch } from "@/context/SearchContext";
import useSearchProperties from '@/src/hooks/useSearchProperties';
import useSearchUrlState from '@/src/hooks/useSearchUrlState';
import { useFilterConfig, CATEGORY_FILTERS } from "@/config/filter-config";
import usePropertyCategories from '@/src/hooks/usePropertyCategories';
import { useTranslation } from "react-i18next";
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
  const detailsOpacity = useRef(new Animated.Value(0)).current;

  const { t } = useTranslation();
  const { state } = useSearch();
  const { filters, selectedMainCategoryInPanel } = state;
  const { updateFilter, resetFilters, search, selectMainCategory } = useSearchProperties();
  const { categoriesByType } = usePropertyCategories();
  const { forceSyncUrl } = useSearchUrlState();
  const ALL_FILTERS = useFilterConfig();

  const panelHeight = Dimensions.get('window').height * 0.85;
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const backgroundPrimary = useThemeColor({}, "background");
  const backgroundMuted = useThemeColor({}, "backgroundMuted");
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");

  useEffect(() => {
    if (isOpen) {
      translateY.setValue(2000);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(0.5)),
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedMainCategoryInPanel) {
      detailsOpacity.setValue(0);
      Animated.timing(detailsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMainCategoryInPanel]);

  const hidePanel = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 2000,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleReset = (keepTransactionType = true) => {
    resetFilters(keepTransactionType);
  };

  const updateGeneralFilter = (newFilters: Record<string, any>) => {
    updateFilter('general', newFilters as any);
  };

  const updateCategoryFilter = (categoryKey: keyof typeof categoryStateToConfigMap, newFilters: Record<string, any>) => {
    updateFilter(categoryKey as any, newFilters as any);
  };

  const renderControl = (def: FilterDefinition, currentCategoryKey?: keyof typeof categoryStateToConfigMap) => {
    const isGeneral = !currentCategoryKey;
    const rawState = isGeneral
      ? (filters.general as any)[def.key]
      : ((filters as any)[currentCategoryKey as string] ?? {})[def.key];

    const unwrapValue = (v: any): any => {
      if (v === undefined) return undefined;
      if (v === null) return null;
      if (typeof v !== 'object') return v;
      if ('value' in v) return unwrapValue((v as any).value);
      return v;
    };

    const unwrapped = unwrapValue(rawState);
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
              label={t('filterPanel.maxPrice')}
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
        if (def.key === 'acceptedCondition' || (def.options && def.options.length > 3)) {
          return (
            <View key={def.key} style={styles.controlContainer}>
              <ThemedText style={styles.controlLabel}>{def.label}</ThemedText>
              <ChipSelector
                options={(def.options ?? []).map(o => {
                  if (typeof o === 'object' && o !== null && 'label' in o && 'value' in o) {
                    return { label: o.label, value: o.value };
                  }
                  return { label: String(o), value: o };
                })}
                value={value}
                onChange={(v: any) => onChange(v)}
              />
            </View>
          );
        }
        return (
          <View key={def.key} style={styles.controlContainer}>
            <ThemedText style={styles.controlLabel}>{def.label}</ThemedText>
            <SegmentedControl
              options={(def.options ?? []).map(o => {
                if (typeof o === 'object' && o !== null && 'label' in o && 'value' in o) {
                  return { label: o.label, value: o.value };
                }
                return { label: String(o), value: o };
              })}
              value={value}
              onChange={(v: any) => onChange(v)}
            />
          </View>
        );
      case 'Switch':
        return (
          <View key={def.key} style={[styles.switchCard, { backgroundColor: backgroundPrimary }]}>
            <ThemedText style={styles.switchLabel}>{def.label}</ThemedText>
            <CustomToggle
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
            showPresets={def.key !== 'minYearBuilt'}
            minValue={def.min}
            maxValue={def.max}
            unit={def.unit}
            value={(() => {
              try {
                const display = unwrapValue(value);
                if (display === null || display === undefined) return '';
                if (typeof display === 'number' || typeof display === 'string') return String(display);
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
                return '';
              }
            })()}
            onValueChange={(v: string) => {
              const parsed = v === null || v === '' ? null : Number(v);
              onChange(parsed);
            }}
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

  const availableCategories = Object.keys(CATEGORY_FILTERS);
  const selectedCategoryConfigKey = selectedMainCategoryInPanel
    ? categoryStateToConfigMap[selectedMainCategoryInPanel as string]
    : null;

  const filtersToRender = selectedCategoryConfigKey
    ? (CATEGORY_FILTERS as any)[selectedCategoryConfigKey] ?? []
    : [];

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={hidePanel}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={hidePanel} activeOpacity={1} />
        
          <Animated.View style={[styles.panel, { 
            height: panelHeight,
            backgroundColor: backgroundPrimary,
            transform: [{ translateY }]
          }]}>
            {/* Modal Handle */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: textColor }]} />
            </View>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: textColor + '10' }]}>
              <View style={styles.headerLeft}>
                <View style={[styles.headerIcon, { backgroundColor: tintColor + '12' }]}>
                  <Ionicons name="funnel" size={20} color={tintColor} />
                </View>
                <View style={styles.headerTextContainer}>
                  <ThemedText type="defaultSemiBold" style={{ fontSize: 17 }}>Filtri</ThemedText>
                  <ThemedText style={[styles.headerSubtitle, { color: textColor, opacity: 0.6 }]}>
                    {selectedMainCategoryInPanel ? t(`filters.category.${categoryStateToConfigMap[selectedMainCategoryInPanel as string]}`) : t('filterPanel.selectCategory')}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={() => handleReset(false)}
                  style={[styles.resetButton, { backgroundColor: useThemeColor({ light: 'rgba(0,0,0,0.05)', dark: 'rgba(255,255,255,0.15)' }, 'backgroundMuted') }]}
                >
                  <ThemedText style={{ color: useThemeColor({ light: tintColor, dark: textColor }, 'text'), fontWeight: '800', fontSize: 13 }}>Reset</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={hidePanel}
                  style={[styles.closeButton, { backgroundColor: useThemeColor({ light: 'rgba(0,0,0,0.05)', dark: 'rgba(255,255,255,0.15)' }, 'backgroundMuted') }]}
                >
                  <Ionicons name="close" size={18} color={useThemeColor({ light: textColor, dark: textColor }, 'text')} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
              {/* Sezione Budget e Transazione */}
              <View style={[styles.card, { backgroundColor: backgroundMuted }]}>
                <View className="flex-row items-center mb-5">
                  <Ionicons name="wallet-outline" size={14} color={textColor} style={{ opacity: 0.4, marginRight: 8 }} />
                  <ThemedText style={styles.sectionTitle}>Budget & Transazione</ThemedText>
                </View>
                {renderControl(ALL_FILTERS.contract)}
                {renderControl(ALL_FILTERS.priceRange)}
              </View>

              {/* Sezione Localizzazione e Dimensioni */}
              <View style={[styles.card, { backgroundColor: backgroundMuted }]}>
                <View className="flex-row items-center mb-5">
                  <Ionicons name="location-outline" size={14} color={textColor} style={{ opacity: 0.4, marginRight: 8 }} />
                  <ThemedText style={styles.sectionTitle}>Localizzazione & Spazi</ThemedText>
                </View>
                {renderControl(ALL_FILTERS.searchRadiusKm)}
                {renderControl(ALL_FILTERS.size)}
              </View>

              {/* Sezione Caratteristiche Generali */}
              <View style={[styles.card, { backgroundColor: backgroundMuted }]}>
                <View className="flex-row items-center mb-5">
                  <Ionicons name="options-outline" size={14} color={textColor} style={{ opacity: 0.4, marginRight: 8 }} />
                  <ThemedText style={styles.sectionTitle}>Caratteristiche</ThemedText>
                </View>
                {renderControl(ALL_FILTERS.acceptedCondition)}
                {renderControl(ALL_FILTERS.minEnergyRating)}
                {renderControl(ALL_FILTERS.minYearBuilt)}
              </View>

              {!selectedMainCategoryInPanel ? (
                <View style={styles.categorySection}>
                  <ThemedText type="subtitle" style={styles.categoryTitle}>Tipologia</ThemedText>
                  <View style={styles.categoryGrid}>
                    {availableCategories.map((catKey) => {
                      const stateKey = Object.keys(categoryStateToConfigMap).find(k => categoryStateToConfigMap[k] === catKey) as keyof typeof categoryStateToConfigMap | undefined;
                      const isSelected = stateKey ? selectedMainCategoryInPanel === stateKey : false;
                      return (
                        <TouchableOpacity
                          key={catKey}
                          onPress={() => selectMainCategory(stateKey as any)}
                          style={[
                            styles.categoryButton,
                            {
                              backgroundColor: isSelected ? tintColor : backgroundMuted,
                              borderColor: isSelected ? tintColor : textColor + '10'
                            }
                          ]}
                        >
                          <ThemedText style={[styles.categoryButtonText, { color: isSelected ? buttonTextColor : textColor }]}>
                            {t(`filters.category.${catKey}`)}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <Animated.View style={{ opacity: detailsOpacity }}>
                  <View style={styles.categoryHeader}>
                    <ThemedText type="subtitle" style={{ fontSize: 18 }}>Tipologia</ThemedText>
                    <TouchableOpacity
                      onPress={() => selectMainCategory(null)}
                      style={[styles.changeCategoryButton, { backgroundColor: textColor + '05' }]}
                    >
                      <Ionicons name="swap-horizontal" size={14} color={tintColor} />
                      <ThemedText style={{ color: tintColor, marginLeft: 5, fontSize: 12, fontWeight: '700' }}>Cambia</ThemedText>
                    </TouchableOpacity>
                  </View>
  
                  {(() => {
                    const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                    if (!stateKey) return null;
                    const configKey = categoryStateToConfigMap[stateKey as string];
                    const opts = (configKey && categoriesByType && Array.isArray(categoriesByType[configKey]) && categoriesByType[configKey].length > 0)
                      ? categoriesByType[configKey]
                      : [];
                    if (opts.length === 0) return null;
                    const rawCategoryState = ((filters as any)[stateKey] || {}).category;
                    const currentValue = rawCategoryState && typeof rawCategoryState === 'object' && 'value' in rawCategoryState
                      ? rawCategoryState.value
                      : (rawCategoryState ?? undefined);

                    return (
                      <View style={[styles.card, { backgroundColor: backgroundMuted }]}>
                        <View className="flex-row items-center mb-5">
                          <Ionicons name="grid-outline" size={14} color={textColor} style={{ opacity: 0.4, marginRight: 8 }} />
                          <ThemedText style={styles.sectionTitle}>Sottocategoria</ThemedText>
                        </View>
                        <ThemedText style={[styles.controlLabel, { marginBottom: 16 }]}>
                          {t('filters.category.label')} ({t(`filters.category.${categoryStateToConfigMap[stateKey as string]}`)})
                        </ThemedText>
                        <ChipSelector
                          options={opts.map(o => ({ label: t(`filters.category.options.${o}`), value: o }))}
                          value={currentValue}
                          onChange={(v: any) => {
                            updateCategoryFilter(stateKey as any, { category: v });
                          }}
                        />
                    </View>
                  );
                })()}

                <View style={[styles.card, { backgroundColor: backgroundMuted, marginBottom: 40 }]}>
                  <View className="flex-row items-center mb-5">
                    <Ionicons name="list-outline" size={14} color={textColor} style={{ opacity: 0.4, marginRight: 8 }} />
                    <ThemedText style={styles.sectionTitle}>Dettagli Specifici</ThemedText>
                  </View>
                  {filtersToRender.map((key: string) => {
                      const def: FilterDefinition = (ALL_FILTERS as any)[key];
                      if (!def) return null;
                      const stateKey = selectedMainCategoryInPanel as keyof typeof categoryStateToConfigMap | undefined;
                      return renderControl(def, stateKey);
                    })}
                </View>
                </Animated.View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: backgroundPrimary, borderTopColor: textColor + '08' }]}>
              <TouchableOpacity
                onPress={async () => {
                  hidePanel();
                  try {
                    await search();
                    try { forceSyncUrl(); } catch (e) {}
                    if (onApplyAndNavigate) onApplyAndNavigate();
                  } catch (err) {
                    Alert.alert('Errore', 'Si è verificato un errore durante la ricerca. Riprova.');
                  }
                }}
                style={[styles.applyButton, { backgroundColor: buttonBackground }]}
              >
                <Ionicons name="search" size={20} color={buttonTextColor} style={{ marginRight: 8 }} />
                <ThemedText style={[styles.applyButtonText, { color: buttonTextColor }]}>Cerca</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.15,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    marginLeft: 14,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    marginRight: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 24,
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    opacity: 0.4,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  controlContainer: {
    marginBottom: 24,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  switchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  switchLabel: {
    fontWeight: '700',
    fontSize: 15,
  },
  categorySection: {
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryButtonText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  changeCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  applyButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

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
