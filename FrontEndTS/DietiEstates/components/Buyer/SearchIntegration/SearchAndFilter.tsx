import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { ThemedView } from "@/components/ThemedView";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { 
  PropertyFilters, 
  Categories, 
  DEFAULT_PRICE_RANGES,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  INDUSTRIAL_CATEGORIES,
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
    if (!state || !state.filters) {
      return 0;
    }
    const { general, residential, commercial, industrial, land } = state.filters;
    
    // Utilizza i valori di default da initialSearchState per il confronto
    // Questo richiede l'accesso a initialSearchState o a una sua copia/logica simile qui.
    // Per semplicità, assumiamo che initialSearchState sia accessibile o che i valori di default siano noti.
    // Idealmente, initialSearchState dovrebbe essere importato o i suoi valori di default definiti come costanti.
    // Per ora, useremo valori hardcoded rappresentativi dei default per il conteggio.
    // NOTA: Questo dovrebbe essere allineato con initialSearchState in SearchContext.tsx
    const defaultSalePriceRange = DEFAULT_PRICE_RANGES.sale.defaultRange;
    const defaultRentPriceRange = DEFAULT_PRICE_RANGES.rent.defaultRange;
    const currentDefaultPriceRange = general.transactionType === 'rent' ? defaultRentPriceRange : defaultSalePriceRange;
    const defaultSizeRange = { min: 0, max: 1000 }; // Da initialSearchState

    // Check price range
    if (
      general.priceRange.min !== currentDefaultPriceRange.min ||
      general.priceRange.max !== currentDefaultPriceRange.max
    ) {
      count++;
    }

    // Check size range
    if (general.size.min !== defaultSizeRange.min || general.size.max !== defaultSizeRange.max) {
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
    const defaultResidentialFilters = { rooms: "", bathrooms: "", floor: "", elevator: false, pool: false, category: RESIDENTIAL_CATEGORIES[0] };
    const defaultCommercialFilters = { bathrooms: "", emergencyExit: false, constructionDate: "", category: COMMERCIAL_CATEGORIES[0] };
    const defaultIndustrialFilters = { ceilingHeight: "", fireSystem: false, floorLoad: "", offices: "", structure: "", category: INDUSTRIAL_CATEGORIES[0] };
    const defaultLandFilters = { soilType: "", slope: "", category: LAND_CATEGORIES[0] };

    count += countSpecificFilters(residential, defaultResidentialFilters);
    count += countSpecificFilters(commercial, defaultCommercialFilters);
    count += countSpecificFilters(industrial, defaultIndustrialFilters);
    count += countSpecificFilters(land, defaultLandFilters);

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
        filters={state.filters}
        categories={categories}
        selectedMainCategory={state.selectedMainCategoryInPanel}
        onSelectMainCategory={handleSelectMainCategory}
        onUpdateFilters={handleUpdateFilters}
        onApplyAndNavigate={onSearchSubmitNavigate} // Pass the navigation callback here
        onResetFilters={() => handleResetFilters()} // Assicurati di chiamare la funzione
      />
    </>
  );
};
