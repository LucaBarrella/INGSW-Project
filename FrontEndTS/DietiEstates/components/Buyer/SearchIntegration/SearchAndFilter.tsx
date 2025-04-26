import React, { useState } from "react";
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
  onSearch: (query: string) => void;
  onFiltersChange: (filters: PropertyFilters) => void;
  placeholder?: string;
  categories: Categories;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFiltersChange,
  placeholder,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>({
    general: {
      transactionType: "sale",
      priceRange: DEFAULT_PRICE_RANGES.sale.defaultRange,
      size: { min: 50, max: 500 },
    },
    residential: {
      category: RESIDENTIAL_CATEGORIES[0],
      rooms: "",
      bathrooms: "",
      floor: "",
      elevator: false,
      pool: false,
    },
    commercial: {
      category: COMMERCIAL_CATEGORIES[0],
      bathrooms: "",
      emergencyExit: false,
      constructionDate: "",
    },
    industrial: {
      category: INDUSTRIAL_CATEGORIES[0],
      ceilingHeight: "",
      fireSystem: false,
      floorLoad: "",
      offices: "",
      structure: "",
    },
    land: {
      category: LAND_CATEGORIES[0],
      soilType: "",
      slope: "",
    },
  });

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const [tempFilters, setTempFilters] = useState<PropertyFilters>(activeFilters);

  const handleUpdateFilters = (newFilters: PropertyFilters) => {
    setTempFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    onFiltersChange(tempFilters);
  };

  const handleResetFilters = () => {
    const currentTransactionType = tempFilters.general.transactionType;
    const resetFilters: PropertyFilters = {
      general: {
        transactionType: currentTransactionType,
        priceRange: DEFAULT_PRICE_RANGES[currentTransactionType].defaultRange,
        size: { min: 50, max: 500 },
      },
      residential: {
        category: RESIDENTIAL_CATEGORIES[0],
        rooms: "",
        bathrooms: "",
        floor: "",
        elevator: false,
        pool: false,
      },
      commercial: {
        category: COMMERCIAL_CATEGORIES[0],
        bathrooms: "",
        emergencyExit: false,
        constructionDate: "",
      },
      industrial: {
        category: INDUSTRIAL_CATEGORIES[0],
        ceilingHeight: "",
        fireSystem: false,
        floorLoad: "",
        offices: "",
        structure: "",
      },
      land: {
        category: LAND_CATEGORIES[0],
        soilType: "",
        slope: "",
      },
    };
    setTempFilters(resetFilters);
    setActiveFilters(resetFilters);
    setSelectedMainCategory("");
  };

  // Calculate the number of active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    const general = activeFilters.general;
    const currentRange = DEFAULT_PRICE_RANGES[general.transactionType];

    // Check price range
    if (
      general.priceRange.min > currentRange.defaultRange.min ||
      general.priceRange.max < currentRange.defaultRange.max
    ) {
      count++;
    }

    // Check size range
    if (general.size.min > 50 || general.size.max < 500) {
      count++;
    }

    // Check specific category filters based on selectedMainCategory
    if (selectedMainCategory) {
      const category = selectedMainCategory.toLowerCase() as keyof PropertyFilters;
      const specificFilters = activeFilters[category];
      
      if (specificFilters) {
        Object.entries(specificFilters).forEach(([_, value]) => {
          if ((typeof value === "boolean" && value) || 
              (typeof value === "string" && value.length > 0)) {
            count++;
          }
        });
      }
    }

    return count;
  };

  return (
    <>
      <ThemedView className="w-full">
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSearchPress={handleSearch}
          onFilterPress={() => setIsFilterOpen(true)}
          placeholder={placeholder}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </ThemedView>
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={tempFilters}
        categories={categories}
        selectedMainCategory={selectedMainCategory}
        onSelectMainCategory={setSelectedMainCategory}
        onUpdateFilters={handleUpdateFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </>
  );
};
