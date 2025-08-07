import { Ionicons } from '@expo/vector-icons';

export interface Offer {
  id: string;
  status: 'rifiutata' | 'accettata' | 'in attesa';
  address: string;
  amount: string;
  date: string;
  imageUrl: string;
  actionText: string;
  actionIcon: keyof typeof Ionicons.glyphMap;
  actionDescription: string;
}

export const mockOffers: Offer[] = [
  {
    id: '1',
    status: 'rifiutata',
    address: 'Via Roma, 123',
    amount: '250.000 €',
    date: '15/07/2024',
    imageUrl: 'https://picsum.photos/id/10/200/300',
    actionText: 'Contro Proposta',
    actionIcon: 'close',
    actionDescription: 'Invia una controfferta o cerca altre proprietà.',
  },
  {
    id: '2',
    status: 'accettata',
    address: 'Via Milano, 456',
    amount: '320.000 €',
    date: '20/06/2024',
    imageUrl: 'https://picsum.photos/id/20/200/300',
    actionText: 'Contatta',
    actionIcon: 'checkmark',
    actionDescription: "Contatta l'agente per procedere con l'acquisto",
  },
  {
    id: '3',
    status: 'in attesa',
    address: 'Via Torino, 789',
    amount: '180.000 €',
    date: '25/07/2024',
    imageUrl: 'https://picsum.photos/id/30/200/300',
    actionText: 'Ritira Offerta',
    actionIcon: 'refresh',
    actionDescription: 'La tua offerta è in attesa di risposta.',
  },
];