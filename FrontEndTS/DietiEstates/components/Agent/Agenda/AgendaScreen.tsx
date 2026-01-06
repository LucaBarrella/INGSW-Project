import React, { useReducer, useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { VisitRequest } from '../../../src/dto/agenda';
import AgendaHeader from './AgendaHeader';
import ConfirmedSchedule from './ConfirmedSchedule';
import PendingRequests from './PendingRequests';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import { useVisits } from '@/src/hooks/useVisits';
import { t } from 'i18next';
import { useThemeColor } from '@/hooks/useThemeColor';

// State and Reducer remain the same as before

interface AgendaState {
  appointments: VisitRequest[];
  visitRequests: VisitRequest[];
  loading: boolean;
}

type AgendaAction =
  | { type: 'SET_INITIAL_DATA'; payload: { appointments: VisitRequest[]; visitRequests: VisitRequest[] } }
  | { type: 'ACCEPT_REQUEST'; payload: { requestId: number } }
  | { type: 'REJECT_REQUEST'; payload: { requestId: number } };

const initialState: AgendaState = {
  appointments: [],
  visitRequests: [],
  loading: true,
};

function agendaReducer(state: AgendaState, action: AgendaAction): AgendaState {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return {
        ...state,
        appointments: action.payload.appointments,
        visitRequests: action.payload.visitRequests,
        loading: false,
      };
    case 'ACCEPT_REQUEST': {
      const requestToAccept = state.visitRequests.find(req => req.id === action.payload.requestId);
      if (!requestToAccept) return state;

      const existingAppointmentIndex = state.appointments.findIndex(
        app => app.property.id === requestToAccept.property.id && app.startTime.getTime() === requestToAccept.startTime.getTime()
      );

      if (existingAppointmentIndex !== -1) {
        // Raggruppa con un appuntamento esistente
        const updatedAppointments = [...state.appointments];
        const existingAppointment = updatedAppointments[existingAppointmentIndex];
        
        const newClients = requestToAccept.potentialClients;
        // @ts-ignore
        const allClients = [...(existingAppointment.clients || [existingAppointment.client]), ...newClients];

        updatedAppointments[existingAppointmentIndex] = {
          ...existingAppointment,
          // @ts-ignore
          clients: allClients,
          type: 'group',
        };

        return {
          ...state,
          appointments: updatedAppointments,
          visitRequests: state.visitRequests.filter(req => req.id !== action.payload.requestId),
        };
      } else {
        // Crea un nuovo appuntamento
        const newAppointment: VisitRequest = {
          id: requestToAccept.id,
          property: requestToAccept.property,
          userInfo: requestToAccept.potentialClients[0] || requestToAccept.userInfo,
          startTime: requestToAccept.startTime,
          endTime: requestToAccept.endTime,
          potentialClients: requestToAccept.potentialClients,
          status: requestToAccept.status,
        };

        return {
          ...state,
          appointments: [...state.appointments, newAppointment],
          visitRequests: state.visitRequests.filter(req => req.id !== action.payload.requestId),
        };
      }
    }
    case 'REJECT_REQUEST':
      return {
        ...state,
        visitRequests: state.visitRequests.filter(req => req.id !== action.payload.requestId),
      };
    default:
      return state;
  }
}


const AgendaScreen = () => {
  const [state, dispatch] = useReducer(agendaReducer, initialState);
  const [isRequestsVisible, setRequestsVisible] = useState(true);
  const [isScheduleVisible, setScheduleVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { getVisitsOfCurrentAgent, updateVisitStatus } = useVisits();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const toggleRequestsVisibility = () => setRequestsVisible(!isRequestsVisible);
  const toggleScheduleVisibility = () => setScheduleVisible(!isScheduleVisible);

  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        let visitRequestsData = await getVisitsOfCurrentAgent(currentDate);
        let visitRequests: VisitRequest[] = visitRequestsData.pending;
        let appointments: VisitRequest[] = visitRequestsData.confirmed;
        
        dispatch({ type: 'SET_INITIAL_DATA', payload: { appointments, visitRequests } });
      } catch (error) {
        console.error("Errore nel recupero dei dati dell'agenda:", error);
      }
    };

    fetchAgendaData();
  }, [currentDate]);

  const dateChanged = (newDate: Date) => {
    // Non resettare lo stato a vuoto, mantieni i dati precedenti durante il caricamento
    // per evitare il flash bianco. Imposta solo il loading se necessario (opzionale se il fetch è veloce)
    setCurrentDate(newDate);
  }

  const handleAcceptRequest = (requestId: number) => {
    updateVisitStatus(requestId, 'CONFIRMED').then((response) => {
      if (response.success !== false) {
        dispatch({ type: 'ACCEPT_REQUEST', payload: { requestId } });
      }
      else {
        Alert.alert(t('error'), t('errorAcceptingRequestConflict'));
      }
    }).catch(error => {
      Alert.alert(t('error'), t('errorAcceptingRequest'));
      console.error("Errore nel accettare la richiesta di visita:", error);
    });
  };

  const handleRejectRequest = (requestId: number) => {
    updateVisitStatus(requestId, 'REJECTED').then((response) => {
      if (response.success !== false) {
        dispatch({ type: 'REJECT_REQUEST', payload: { requestId } });
      }
      else {
        console.error("Errore nel rifiutare la richiesta di visita, response:", response.message);
      }
    }).catch(error => {
      console.error("Errore nel rifiutare la richiesta di visita:", error);
    });
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    updateVisitStatus(appointmentId, 'CANCELLED').then((response) => {
      if (response.success !== false) {
        // Rimuovi l'appuntamento dallo stato
        const updatedAppointments = state.appointments.filter(app => app.id !== appointmentId);
        dispatch({ type: 'SET_INITIAL_DATA', payload: { appointments: updatedAppointments, visitRequests: state.visitRequests } });
      }
      else {
        Alert.alert(t('error'), t('errorDeletingAppointment'));
        console.error("Errore nel cancellare l'appuntamento, response:", response.message);
      }
    }).catch(error => {
      Alert.alert(t('error'), t('errorDeletingAppointment'));
      console.error("Errore nel cancellare l'appuntamento:", error);
    });
  };

  // Rimuoviamo il blocco di caricamento a schermo intero che causava il flash bianco
  // Mostriamo invece l'interfaccia con un indicatore di caricamento meno invasivo se necessario,
  // oppure lasciamo i dati precedenti finché i nuovi non arrivano (pattern "stale-while-revalidate")

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, backgroundColor }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <AgendaHeader currentDate={currentDate} onCurrentDateChange={dateChanged} />
          
          {state.loading && state.visitRequests.length === 0 && state.appointments.length === 0 ? (
             <View style={{ padding: 20, alignItems: 'center' }}>
               <ActivityIndicator size="small" color={textColor} />
             </View>
          ) : (
            <>
              <PendingRequests
                requests={state.visitRequests}
                onAccept={handleAcceptRequest}
                onDecline={handleRejectRequest}
                isRequestsVisible={isRequestsVisible}
                toggleRequestsVisibility={toggleRequestsVisibility}
              />
              <ConfirmedSchedule
                appointments={state.appointments}
                isScheduleVisible={isScheduleVisible}
                toggleScheduleVisibility={toggleScheduleVisibility}
                onDeleteAppointment={handleDeleteAppointment}
              />
            </>
          )}
        </ScrollView>
      </ThemedView>
    </GestureHandlerRootView>
  );
};

export default AgendaScreen;