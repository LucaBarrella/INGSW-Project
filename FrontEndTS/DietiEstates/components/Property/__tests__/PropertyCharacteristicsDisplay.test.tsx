import React from 'react';
import { render } from '@testing-library/react-native';
import { PropertyCharacteristicsDisplay, mapPropertyDetailToCharacteristics } from '../PropertyCharacteristicsDisplay';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';

// Mock i18next
jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

// Mock hooks
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#000',
}));

// Mock components to simplify rendering
jest.mock('@/components/ThemedIcon', () => ({
  ThemedIcon: ({ accessibilityLabel }: { accessibilityLabel: string }) => {
    const { View } = require('react-native');
    return <View accessibilityLabel={accessibilityLabel} />;
  },
}));

describe('PropertyCharacteristicsDisplay', () => {
  describe('mapPropertyDetailToCharacteristics', () => {
    it('dovrebbe mappare correttamente i dettagli di una proprietà residenziale', () => {
      const mockDetail: Partial<PropertyDetail> = {
        type: 'residential',
        area: 100,
        energyRating: 'A',
        condition: 'NEW',
        yearBuilt: 2022,
        numberOfBedrooms: 3,
        numberOfBathrooms: 2,
        propertyDetails: {
          residential: {
            floor: { value: '2', defaultValue: '0', isModified: true },
            mustHaveElevator: { value: true, defaultValue: false, isModified: true },
          } as any,
        },
      };

      const result = mapPropertyDetailToCharacteristics(mockDetail as PropertyDetail);

      expect(result).toEqual({
        propertyType: 'residential',
        sqft: 100,
        energyRating: 'A',
        condition: 'NEW',
        yearBuilt: 2022,
        bedrooms: 3,
        bathrooms: 2,
        floor: '2',
        hasElevator: true,
      });
    });

    it('dovrebbe mappare correttamente i dettagli di una proprietà commerciale', () => {
      const mockDetail: Partial<PropertyDetail> = {
        type: 'commercial',
        area: 200,
        energyRating: 'B',
        condition: 'GOOD_CONDITION',
        yearBuilt: 2010,
        numberOfBathrooms: 1,
        propertyDetails: {
          commercial: {
            emergencyExit: { value: true, defaultValue: false, isModified: true },
            mustHaveWheelchairAccess: { value: true, defaultValue: false, isModified: true },
          } as any,
        },
      };

      const result = mapPropertyDetailToCharacteristics(mockDetail as PropertyDetail);

      expect(result).toEqual({
        propertyType: 'commercial',
        sqft: 200,
        energyRating: 'B',
        condition: 'GOOD_CONDITION',
        yearBuilt: 2010,
        bathrooms: 1,
        emergencyExit: true,
        wheelchairAccess: true,
      });
    });

    it('dovrebbe mappare correttamente i dettagli di un garage', () => {
      const mockDetail: Partial<PropertyDetail> = {
        type: 'garage',
        area: 20,
        energyRating: 'NOT_APPLIABLE',
        condition: 'RENOVATED',
        yearBuilt: 1995,
        propertyDetails: {
          industrial: {
            fireSystem: { value: true, defaultValue: false, isModified: true },
            ceilingHeight: { value: '3.5', defaultValue: '0', isModified: true },
          },
        } as any,
      };

      const result = mapPropertyDetailToCharacteristics(mockDetail as PropertyDetail);

      expect(result).toEqual({
        propertyType: 'garage',
        sqft: 20,
        energyRating: 'NOT_APPLIABLE',
        condition: 'RENOVATED',
        yearBuilt: 1995,
        fireSuppression: true,
        ceilingHeight: 3.5,
      });
    });

    it('dovrebbe mappare correttamente i dettagli di un terreno', () => {
      const mockDetail: Partial<PropertyDetail> = {
        type: 'land',
        area: 1000,
        condition: 'NEW',
        yearBuilt: 2024,
        propertyDetails: {
          land: {
            soilType: { value: 'Clay', defaultValue: '', isModified: true },
          } as any,
        },
      };

      const result = mapPropertyDetailToCharacteristics(mockDetail as PropertyDetail);

      expect(result).toEqual({
        propertyType: 'land',
        sqft: 1000,
        energyRating: undefined,
        condition: 'NEW',
        yearBuilt: 2024,
        soilComposition: 'Clay',
      });
    });
  });

  describe('Rendering del componente', () => {
    it('dovrebbe renderizzare i campi comuni per tutte le proprietà', () => {
      const property = {
        propertyType: 'residential',
        sqft: 85,
        condition: 'NEW',
        yearBuilt: 2023,
        energyRating: 'A+',
      };

      const { getByText, getByLabelText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(getByText('85 mq')).toBeTruthy();
      expect(getByText('property_status.NEW')).toBeTruthy();
      expect(getByText('2023')).toBeTruthy();
      expect(getByText('A+')).toBeTruthy();
      
      expect(getByLabelText('material-symbols:square-foot')).toBeTruthy();
      expect(getByLabelText('material-symbols:info')).toBeTruthy();
      expect(getByLabelText('material-symbols:calendar-today')).toBeTruthy();
      expect(getByLabelText('material-symbols:energy-program-saving')).toBeTruthy();
    });

    it('dovrebbe renderizzare i campi specifici per residenziale', () => {
      const property = {
        propertyType: 'residential',
        bedrooms: 4,
        bathrooms: 2,
        floor: '3',
        hasElevator: true,
      };

      const { getByText, getByLabelText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(getByText('4')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy(); // Il componente non usa il label per i valori non booleani
      expect(getByText('Ascensore: Sì')).toBeTruthy();

      expect(getByLabelText('material-symbols:bed')).toBeTruthy();
      expect(getByLabelText('material-symbols:bathtub')).toBeTruthy();
      expect(getByLabelText('material-symbols:layers')).toBeTruthy();
      expect(getByLabelText('material-symbols:elevator')).toBeTruthy();
    });

    it('dovrebbe renderizzare i campi specifici per commerciale', () => {
      const property = {
        propertyType: 'commercial',
        emergencyExit: true,
        bathrooms: 1,
        wheelchairAccess: false,
      };

      const { getByText, getByLabelText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(getByText('Uscita Emergenza: Sì')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
      expect(getByText('Accesso Disabili: No')).toBeTruthy();

      expect(getByLabelText('material-symbols:exit-to-app')).toBeTruthy();
      expect(getByLabelText('material-symbols:bathtub')).toBeTruthy();
      expect(getByLabelText('material-symbols:accessible')).toBeTruthy();
    });

    it('dovrebbe renderizzare i campi specifici per garage', () => {
      const property = {
        propertyType: 'garage',
        fireSuppression: true,
        ceilingHeight: 4.5,
      };

      const { getByText, getByLabelText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(getByText('Antincendio: Sì')).toBeTruthy();
      expect(getByText('4.5 m')).toBeTruthy();

      expect(getByLabelText('material-symbols:fire-extinguisher')).toBeTruthy();
      expect(getByLabelText('material-symbols:height')).toBeTruthy();
    });

    it('dovrebbe renderizzare i campi specifici per terreno', () => {
      const property = {
        propertyType: 'land',
        soilComposition: 'Argilloso',
      };

      const { getByText, getByLabelText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(getByText('Argilloso')).toBeTruthy();
      expect(getByLabelText('material-symbols:forest')).toBeTruthy();
    });

    it('non dovrebbe renderizzare campi con valori null o undefined', () => {
      const property = {
        propertyType: 'residential',
        sqft: undefined,
        bedrooms: null as any,
      };

      const { queryByLabelText, queryByText } = render(<PropertyCharacteristicsDisplay property={property} />);

      expect(queryByLabelText('material-symbols:square-foot')).toBeNull();
      expect(queryByLabelText('material-symbols:bed')).toBeNull();
      expect(queryByText('mq')).toBeNull();
    });
  });
});