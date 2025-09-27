import React, { useState } from "react";
import { initialSearchState, useSearch } from "@/context/SearchContext";
import { ThemedView } from "@/components/ThemedView";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import {
  PropertyFilters,
  Categories,
  DEFAULT_PRICE_RANGES,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  GARAGE_CATEGORIES,
  LAND_CATEGORIES
} from "./types";

interface SearchAndFilterProps {
  placeholder?: string;
  categories: Categories;
  onSearchSubmitNavigate?: () => void; // Added new prop
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  placeholder,
  categories,
  onSearchSubmitNavigate, // Destructure the new prop
}) => {
  const { state, dispatch } = useSearch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (text: string) => {
    dispatch({ type: 'SET_QUERY', payload: text });
  };

  // onSearchPress non è più gestito qui, la pagina dei risultati reagirà al context

  const handleUpdateFilters = (
    updatedPart: Partial<PropertyFilters> |
                 { category: keyof Omit<PropertyFilters, 'general'>; newFilters: Partial<PropertyFilters[keyof Omit<PropertyFilters, 'general'>]> } |
                 { subCategory: 'general'; newFilters: Partial<PropertyFilters['general']> }
  ) => {
    dispatch({ type: 'UPDATE_FILTER', payload: updatedPart });
  };
  
  const handleResetFilters = (keepTransactionType?: boolean) => {
    // Il dispatch di RESET_FILTERS ora gestisce anche il reset di selectedMainCategoryInPanel nel reducer
    dispatch({ type: 'RESET_FILTERS', payload: { keepTransactionType } });
  };

  const handleSelectMainCategory = (categoryKey: keyof Omit<PropertyFilters, 'general'> | null) => {
    dispatch({ type: 'SET_SELECTED_MAIN_CATEGORY_IN_PANEL', payload: categoryKey });
  };
  
  const handleClosePanel = () => {
    setIsFilterOpen(false);
    // Non c'è più tempFilters da ripristinare
  };

  // Calculate the number of active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    // Aggiungi un controllo per assicurarti che state e state.filters esistano
    if (!state || !state.filters || !state.filters.general) {
      return 0;
    }

    // Fast path: se i filtri sono esattamente uguali ai default iniziali, il conteggio è 0.
    // Usiamo JSON.stringify come confronto rapido (sufficiente qui dato che la struttura è stabile).
    try {
      if (JSON.stringify(state.filters) === JSON.stringify(initialSearchState.filters)) {
        return 0;
      }
    } catch (e) {
      // In caso di errori nel stringify, prosegui con il calcolo normale
      console.warn('[SearchAndFilter] Error comparing filters to defaults', e);
    }
    const { general, residential, commercial, garage, land } = state.filters;
    
    // Usiamo i valori di default da initialSearchState per avere consistenza
    const defaultSalePriceRange = DEFAULT_PRICE_RANGES.sale.defaultRange;
    const defaultRentPriceRange = DEFAULT_PRICE_RANGES.rent.defaultRange;
    const currentDefaultPriceRange = (general?.contract || 'sale') === 'rent' ? defaultRentPriceRange : defaultSalePriceRange;
    const defaultSizeRange = initialSearchState.filters.general.size;
    const defaultSearchRadiusRange = initialSearchState.filters.general.searchRadiusKm || { min: 20, max: 20 };
    

    // Check price range - confronto più robusto che considera anche il tipo di contract
    const isPriceRangeDefault = (
      general.priceRange.min === currentDefaultPriceRange.min &&
      general.priceRange.max === currentDefaultPriceRange.max
    );
    
    if (!isPriceRangeDefault) {
      count++;
    }

    // Check size range
    if (general.size.min !== defaultSizeRange.min || general.size.max !== defaultSizeRange.max) {
      count++;
    }

    // Check search radius range
    if (general.searchRadiusKm &&
        (general.searchRadiusKm.min !== defaultSearchRadiusRange.min ||
         general.searchRadiusKm.max !== defaultSearchRadiusRange.max)) {
      count++;
    }
    
    // Funzione helper per contare i filtri attivi in una sottocategoria rispetto ai default
    const countSpecificFilters = (
        filtersObject: Record<string, any>,
        defaultValues: Record<string, any>
      ) => {
      let specificCount = 0;
      for (const key in filtersObject) {
        // Ignora 'category' stessa come filtro modificabile qui, contiamo i suoi attributi
        if (key === 'category' && typeof filtersObject[key] === 'string') continue;

        const value = filtersObject[key];
        const defaultValue = defaultValues[key];

        if (typeof value === 'boolean' && value !== defaultValue) {
          specificCount++;
        } else if (typeof value === 'string' && value !== defaultValue && value.length > 0) {
          // Se il default è una stringa vuota, qualsiasi valore non vuoto è un filtro attivo
          specificCount++;
        } else if (typeof value === 'number' && value !== defaultValue) {
          specificCount++;
        }
        // Potrebbe essere necessario gestire altri tipi o logiche più complesse se i filtri evolvono
      }
      return specificCount;
    };
    
    // Valori di default da initialSearchState.filters (o una rappresentazione di essi)
    const defaultResidentialFilters = {
      category: RESIDENTIAL_CATEGORIES[0],
      minNumberOfFloors: undefined,
      minNumberOfRooms: "",
      minNumberOfBathrooms: "",
      floor: "",
      mustHaveElevator: false,
      hasPool: false,
      minParkingSpaces: undefined,
    };
    const defaultCommercialFilters = {
      category: COMMERCIAL_CATEGORIES[0],
      minNumberOfFloors: undefined,
      minNumberOfRooms: undefined,
      minNumberOfBathrooms: undefined,
      mustHaveWheelchairAccess: false,
      constructionYear: "",
    };
    const defaultGarageFilters = {
      category: GARAGE_CATEGORIES[0],
      minNumberOfFloors: undefined,
      mustHaveSurveillance: false,
    };
    const defaultLandFilters = {
      category: LAND_CATEGORIES[0],
      landType: "",
      mustBeAccessibleFromStreet: false,
      slope: 0,
    };
    
    count += countSpecificFilters(residential as any, defaultResidentialFilters as any);
    count += countSpecificFilters(commercial as any, defaultCommercialFilters as any);
    count += countSpecificFilters(garage as any, defaultGarageFilters as any);
    count += countSpecificFilters(land as any, defaultLandFilters as any);

    return count;
  };


  return (
    <>
      <ThemedView className="w-full">
        <SearchBar
          value={state.searchQuery}
          onChangeText={handleSearchChange}
          onSearchPress={onSearchSubmitNavigate} // Pass the navigation callback here
          onFilterPress={() => setIsFilterOpen(true)}
          placeholder={placeholder}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </ThemedView>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={handleClosePanel}
        onApplyAndNavigate={onSearchSubmitNavigate}
      />
    </>
  );
};
