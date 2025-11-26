import React, { useReducer, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { VisitRequest } from '../../../src/dto/agenda';
import AgendaHeader from './AgendaHeader';
import ConfirmedSchedule from './ConfirmedSchedule';
import PendingRequests from './PendingRequests';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/ThemedView';
import { useVisits } from '@/src/hooks/useVisits';
import { t } from 'i18next';

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
          userInfo: requestToAccept.potentialClients[0],
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

  const toggleRequestsVisibility = () => setRequestsVisible(!isRequestsVisible);
  const toggleScheduleVisibility = () => setScheduleVisible(!isScheduleVisible);

  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        let visitRequestsData = await getVisitsOfCurrentAgent(currentDate);
        let visitRequests: VisitRequest[] = visitRequestsData.pending;
        let appointments: VisitRequest[] = visitRequestsData.others;
        
        dispatch({ type: 'SET_INITIAL_DATA', payload: { appointments, visitRequests } });
      } catch (error) {
        console.error("Errore nel recupero dei dati dell'agenda:", error);
      }
    };

    fetchAgendaData();
  }, []);

  const handleAcceptRequest = (requestId: number) => {
    updateVisitStatus(requestId, 'CONFIRMED').then((response) => {
      if (response.success) {
        dispatch({ type: 'ACCEPT_REQUEST', payload: { requestId } });
      }
      else {
        console.error("Errore nell'accettare la richiesta di visita:", response.message);
      }
    }).catch(error => {
      console.error("Errore nell'accettare la richiesta di visita:", error);
    });
  };

  const handleRejectRequest = (requestId: number) => {
    updateVisitStatus(requestId, 'REJECTED').then((response) => {
      if (response.success) {
        dispatch({ type: 'REJECT_REQUEST', payload: { requestId } });
      }
      else {
        console.error("Errore nel rifiutare la richiesta di visita:", response.message);
      }
    }).catch(error => {
      console.error("Errore nel rifiutare la richiesta di visita:", error);
    });
  };

  if (state.loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">{t('loadingAgenda')}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView className="flex-1 bg-gray-50">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <AgendaHeader currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
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
          />
        </ScrollView>
      </ThemedView>
    </GestureHandlerRootView>
  );
};

export default AgendaScreen;