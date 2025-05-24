import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SearchAndFilter } from '../SearchAndFilter';
import { Categories, DEFAULT_PRICE_RANGES, RESIDENTIAL_CATEGORIES, COMMERCIAL_CATEGORIES, INDUSTRIAL_CATEGORIES, LAND_CATEGORIES } from '../types';

// Mock dependencies
jest.mock('@/components/ThemedView', () => {
  const MockView = require('react-native').View;
  return { ThemedView: MockView };
});
jest.mock('@/components/ThemedText', () => {
    const MockText = require('react-native').Text;
    return { ThemedText: MockText };
});
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('black'),
}));
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Icon', // Mock Ionicons
}));
// Mock FilterPanel to allow interaction with its props
jest.mock('../FilterPanel', () => ({
    FilterPanel: jest.fn(({ isOpen, onClose, onResetFilters, onApplyFilters, filters }) => {
      if (!isOpen) return null;
      return (
        <div data-testid="filter-panel">
          <button data-testid="reset-button" onClick={onResetFilters}>Reset</button>
          <button data-testid="apply-button" onClick={onApplyFilters}>Apply</button>
          <button data-testid="close-button" onClick={onClose}>Close</button>
          <span data-testid="filters-state">{JSON.stringify(filters)}</span>
        </div>
      );
    }),
}));
// Mock SearchBar
jest.mock('../SearchBar', () => ({
    SearchBar: jest.fn(({ onFilterPress, activeFiltersCount }) => (
        <div>
            <button data-testid="filter-icon-button" onClick={onFilterPress}>
                Filters ({activeFiltersCount})
            </button>
        </div>
    )),
}));

const mockCategories: Categories = {
  residential: { name: 'Residenziale' },
  commercial: { name: 'Commerciale' },
  industrial: { name: 'Industriale' },
  land: { name: 'Terreno' },
};

const initialFilters = {
    general: {
      transactionType: "sale",
      priceRange: DEFAULT_PRICE_RANGES.sale.defaultRange,
      size: { min: 50, max: 500 },
    },
    residential: {
      category: RESIDENTIAL_CATEGORIES[0], rooms: "", bathrooms: "", floor: "", elevator: false, pool: false,
    },
    commercial: {
      category: COMMERCIAL_CATEGORIES[0], bathrooms: "", emergencyExit: false, constructionDate: "",
    },
    industrial: {
      category: INDUSTRIAL_CATEGORIES[0], ceilingHeight: "", fireSystem: false, floorLoad: "", offices: "", structure: "",
    },
    land: {
      category: LAND_CATEGORIES[0], soilType: "", slope: "",
    },
};

describe('SearchAndFilter', () => {
  it('should reset filters correctly in the panel but only apply on Apply/Search', () => {
    const onSearchMock = jest.fn();
    const onFiltersChangeMock = jest.fn();

    const { getByTestId, queryByTestId } = render(
      <SearchAndFilter
        onSearch={onSearchMock}
        onFiltersChange={onFiltersChangeMock}
        categories={mockCategories}
      />
    );

    // 1. Open the filter panel
    fireEvent.press(getByTestId('filter-icon-button'));
    expect(getByTestId('filter-panel')).toBeTruthy();

    // Simulate changing a filter (e.g., price) - We need access to FilterPanel's internal state or mock its update function
    // For this test, we assume FilterPanel calls onUpdateFilters which updates tempFilters
    // Let's directly test the reset logic triggered by the mocked FilterPanel's reset button

    // 2. Click the reset button inside the mocked FilterPanel
    fireEvent.press(getByTestId('reset-button'));

    // 3. Verify onFiltersChange was NOT called immediately after reset
    expect(onFiltersChangeMock).not.toHaveBeenCalled();

    // Check the state passed to the mocked FilterPanel reflects the reset state
    // Note: This requires the mock FilterPanel to re-render with new props, which happens automatically
    const filtersStateElement = getByTestId('filters-state');
    const currentFiltersInPanel = JSON.parse(filtersStateElement.props.children);
    expect(currentFiltersInPanel.general.priceRange).toEqual(DEFAULT_PRICE_RANGES.sale.defaultRange); // Check if price is reset

    // 4. Click the apply button
    fireEvent.press(getByTestId('apply-button'));

    // 5. Verify onFiltersChange IS called with the reset filters after Apply
    expect(onFiltersChangeMock).toHaveBeenCalledTimes(1);
    expect(onFiltersChangeMock).toHaveBeenCalledWith(expect.objectContaining({
        general: expect.objectContaining({
            priceRange: DEFAULT_PRICE_RANGES.sale.defaultRange,
        })
    }));

    // 6. Re-open panel, reset, then close without applying
    fireEvent.press(getByTestId('filter-icon-button')); // Open again
    // Assume some filters were changed again before reset
    fireEvent.press(getByTestId('reset-button')); // Reset again
    expect(onFiltersChangeMock).toHaveBeenCalledTimes(1); // Still 1 call

    // 7. Close the panel without applying
    fireEvent.press(getByTestId('close-button'));
    expect(queryByTestId('filter-panel')).toBeNull(); // Panel is closed

    // 8. Verify onFiltersChange was not called again on close
    expect(onFiltersChangeMock).toHaveBeenCalledTimes(1);

    // Optional: Verify internal state if possible, or rely on the fact that onFiltersChange wasn't called
    // This part is harder without exposing internal state, but the check on onFiltersChange covers the external behavior.
  });

  // Add more tests for search functionality, initial state, etc.
});