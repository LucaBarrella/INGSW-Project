import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { PropertyType } from './Step1_PropertyType'; // Importa il tipo
import { useThemeColor } from '@/hooks/useThemeColor';

interface PropertyTypeDescriptionProps {
  selectedType: PropertyType | null;
}

// Definisci le descrizioni per ogni tipo
const descriptions: Record<PropertyType, string> = {
  RESIDENTIAL: 'Ideale per case, appartamenti e spazi abitativi. Include caratteristiche come stanze, bagni e servizi.',
  COMMERCIAL: 'Adatto per negozi, uffici e attività commerciali. Considera aspetti come visibilità, accessibilità e spazi comuni.',
  INDUSTRIAL: 'Per magazzini, fabbriche e strutture produttive. Valuta altezza soffitti, capacità di carico e sistemi antincendio.',
  LAND: 'Terreni edificabili o agricoli. Specificare tipo di suolo, pendenza e potenzialità di sviluppo.',
};

export default function PropertyTypeDescription({ selectedType }: PropertyTypeDescriptionProps) {
  const cardBackgroundColor = useThemeColor({ light: '#F3F4F6', dark: '#2C2C2E' }, 'background'); // Grigio chiaro/scuro
  const textColor = useThemeColor({}, 'text');

  if (!selectedType) {
    return null; // Non mostrare nulla se nessun tipo è selezionato
  }

  return (
    <ThemedView
      className="mt-6 p-4 rounded-lg"
      style={{ backgroundColor: cardBackgroundColor }}
    >
      <ThemedText type="defaultSemiBold" className="mb-2">
        {/* Mappa il tipo selezionato a un titolo più leggibile */}
        {selectedType === 'RESIDENTIAL' ? 'Proprietà Residenziale' :
         selectedType === 'COMMERCIAL' ? 'Proprietà Commerciale' :
         selectedType === 'INDUSTRIAL' ? 'Proprietà Industriale' :
         'Terreno'}
      </ThemedText>
      <ThemedText type="default" style={{ color: textColor }}>
        {descriptions[selectedType]}
      </ThemedText>
      {/* Potremmo aggiungere qui i punti elenco del mockup se necessario */}
    </ThemedView>
  );
}