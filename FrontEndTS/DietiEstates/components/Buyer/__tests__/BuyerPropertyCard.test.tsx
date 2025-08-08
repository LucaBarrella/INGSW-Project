import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BuyerPropertyCard } from '../BuyerPropertyCard';
import { useRouter } from 'expo-router';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';

// Mock di expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const mockProperty: PropertyDetail = {
  id: 1,
  id_address: 1,
  id_agent: 1,
  area: 120,
  contractType: 'sale',
  price: 300000,
  propertyCategory: 'Residential',
  type: 'residential',
  status: 'new',
  description: 'A beautiful house',
  energyRating: 'A',
  yearBuilt: 2020,
  numberOfBedrooms: 3,
  numberOfBathrooms: 2,
  features: ['garden', 'pool'],
  createdAt: new Date().toISOString(),
  images: [],
  agent: {
    id: 1,
    name: 'Test Agent',
    agencyName: 'Test Agency',
    profileImageUrl: '',
    contact: ''
  },
  city: 'Test City',
  latitude: 0,
  longitude: 0,
  propertyDetails: {},
  imageUrl: 'https://via.placeholder.com/150'
};

describe('BuyerPropertyCard', () => {
  it('chiama router.push con i parametri corretti al click', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    const { getByTestId } = render(
      <BuyerPropertyCard property={mockProperty} onPress={() => {}} />
    );

    // Assumendo che PropertyCard abbia un testID 'property-card'
    // o che l'evento onPress sia direttamente su un TouchableOpacity
    // Dato che non abbiamo il codice di PropertyCard, applichiamo il test al contenitore
    // e simuliamo il press sull'azione handleDetailsPress.
    // Per fare ciò, dobbiamo trovare un modo per triggerare `handleDetailsPress`.
    // La soluzione migliore è rendere `PropertyCard` testabile o usare `fireEvent` sul componente che ha l'onPress.
    // In questo caso, `PropertyCard` riceve `onPress` come prop.
    
    // Per simulare, dobbiamo trovare il componente che riceve `handleDetailsPress`.
    // `BuyerPropertyCard` passa `handleDetailsPress` a `PropertyCard` come prop `onPress`.
    // Quindi, dobbiamo simulare la chiamata di quella prop.
    // Il modo più pulito è testare l'integrazione, ma qui testiamo l'unità.
    // Troviamo il componente `PropertyCard` e triggeriamo il suo `onPress`.
    
    // Poiché non possiamo accedere direttamente alle props di un componente figlio in modo pulito con RTL,
    // e non abbiamo un testID, la soluzione migliore è mockare `PropertyCard` stessa.

    // Poiché BuyerPropertyCard passa la sua prop onPress a PropertyCard,
    // possiamo semplicemente triggerare l'evento press sul componente renderizzato.
    const { getByTestId } = render(
      <BuyerPropertyCard property={mockProperty} onPress={() => {}} />
    );

    // Dobbiamo aggiungere un testID al TouchableOpacity in BuyerPropertyCard
    // per poterlo selezionare. Temporaneamente, assumiamo che il press
    // sia sul componente radice di PropertyCard.
    // Per un test unitario corretto, mockiamo PropertyCard.
    jest.mock('@/components/Agent/PropertyListing/PropertyCard', () => {
      const { TouchableOpacity } = require('react-native');
      return {
        PropertyCard: (props: any) => (
          <TouchableOpacity testID="property-card" onPress={props.onPress} />
        ),
      };
    });

    const { getByTestId: getByTestIdMocked } = render(
      <BuyerPropertyCard property={mockProperty} onPress={() => {}} />
    );

    const propertyCard = getByTestIdMocked('property-card');
    fireEvent.press(propertyCard);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(protected)/(buyer)/property-detail',
      params: { id: mockProperty.id },
    });
  });
});