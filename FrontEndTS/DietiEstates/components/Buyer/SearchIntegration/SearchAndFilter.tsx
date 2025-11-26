import React, { useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { ThemedView } from "@/components/ThemedView";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import useSearchProperties from '@/src/hooks/useSearchProperties';
import { Categories } from "./types";
import { Alert } from "react-native";
interface SearchAndFilterProps {
  placeholder?: string;
  categories?: Categories;
  onSearchSubmitNavigate?: () => void; // Added new prop
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  placeholder,
  onSearchSubmitNavigate, // Destructure the new prop
}) => {
  const { state, dispatch } = useSearch();
  const { activeFiltersCount } = useSearchProperties();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
 
  const handleSearchChange = (text: string) => {
    dispatch({ type: 'SET_QUERY', payload: text });
  };

   // onSearchPress non è più gestito qui, la pagina dei risultati reagirà al context
  // handleUpdateFilters ora instrada le chiamate verso updateFilter esposto dall'hook.
  
  
  const handleClosePanel = () => {
    setIsFilterOpen(false);
    // Non c'è più tempFilters da ripristinare
  };

  const handleSearchOrFilterAction = (action: 'search' | 'filter') => {
    if (!state.geolocation) {
      Alert.alert(
        "Località non selezionata",
        "Per favore, inserisci una località nella barra di ricerca prima di avviare la ricerca o applicare filtri."
      );
      return;
    }

    if (action === 'search' && onSearchSubmitNavigate) {
      onSearchSubmitNavigate();
    } else if (action === 'filter') {
      setIsFilterOpen(true);
    }
  };

  return (
    <>
      <ThemedView className="w-full">
        <SearchBar
          value={state.searchQuery}
          onChangeText={handleSearchChange}
          onSearchPress={() => handleSearchOrFilterAction('search')}
          onFilterPress={() => handleSearchOrFilterAction('filter')}
          placeholder={placeholder}
          activeFiltersCount={activeFiltersCount}
        />
      </ThemedView>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={handleClosePanel}
        onApplyAndNavigate={() => handleSearchOrFilterAction('search')}
      />
    </>
  );
};
