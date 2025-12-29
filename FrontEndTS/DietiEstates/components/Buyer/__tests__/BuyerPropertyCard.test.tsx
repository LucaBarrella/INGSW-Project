import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PropertyCard } from '@/components/Agent/PropertyListing/PropertyCard';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';

const mockProperty: PropertyDetail = {
  id: 1,
  id_address: 1,
  id_agent: 1,
  area: 120,
  contractType: 'sale',
  price: 300000,
  propertyCategory: 'Residential',
  type: 'residential',
  description: 'A beautiful house',
  energyRating: 'A',
  yearBuilt: 2020,
  numberOfBedrooms: 3,
  numberOfBathrooms: 2,
  features: ['garden', 'pool'],
  createdAt: [2025, 12, 28, 10, 0],
  updatedAt: [2025, 12, 28, 10, 0],
  images: [],
  agent: {
    id: 1,
    firstName: 'Test',
    lastName: 'Agent',
    agency: { name: 'Test Agency' },
    profileImageUrl: '',
    contact: ''
  },
  address: {
    city: 'Test City',
    province: 'TS',
    country: 'Italy',
    street: 'Test Street',
    streetNumber: '1',
    latitude: 0,
    longitude: 0
  },
  propertyDetails: {},
  imageUrl: 'https://via.placeholder.com/150',
  condition: 'NEW'
};

describe('PropertyCard', () => {
  it('chiama onPress al click', () => {
    const mockOnPress = jest.fn();
    
    const { getByRole } = render(
      <PropertyCard property={mockProperty} onPress={mockOnPress} />
    );

    const card = getByRole('button');
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});