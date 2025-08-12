import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../../types/agenda';
import TimelineEvent from './TimelineEvent';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ConfirmedScheduleProps {
  appointments: Appointment[];
  isScheduleVisible: boolean;
  toggleScheduleVisibility: () => void;
}

const ConfirmedSchedule: React.FC<ConfirmedScheduleProps> = ({ appointments, isScheduleVisible, toggleScheduleVisibility }) => {

  const groupAndSlotAppointments = (appointments: Appointment[]): { type: 'event' | 'empty', data: Appointment[] | { startTime: Date; endTime: Date } }[] => {
    if (!appointments.length) return [];

    const sorted = [...appointments].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const timelineItems: { type: 'event' | 'empty', data: Appointment[] | { startTime: Date; endTime: Date } }[] = [];

    let lastEndTime = sorted[0].startTime; // Inizia con l'ora di inizio del primo appuntamento

    for (let i = 0; i < sorted.length; i++) {
      const currentApp = sorted[i];

      // Aggiungi un "buco" se c'è un intervallo tra l'ultimo appuntamento e quello attuale
      if (currentApp.startTime.getTime() > lastEndTime.getTime()) {
        timelineItems.push({
          type: 'empty',
          data: { startTime: lastEndTime, endTime: currentApp.startTime },
        });
      }

      // Raggruppa appuntamenti sovrapposti o consecutivi
      const group: Appointment[] = [currentApp];
      let j = i + 1;
      while (j < sorted.length && sorted[j].startTime.getTime() < currentApp.endTime.getTime()) {
        group.push(sorted[j]);
        j++;
      }
      timelineItems.push({ type: 'event', data: group });
      lastEndTime = group[group.length - 1].endTime; // Aggiorna l'ultimo orario di fine

      i = j - 1; // Salta gli appuntamenti già raggruppati
    }

    return timelineItems;
  };

  const timelineItems = groupAndSlotAppointments(appointments);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const cardBackgroundColor = useThemeColor({}, 'background');
  const cardBorderColor = useThemeColor({}, 'border');

  return (
    <View className="p-4">
      <TouchableOpacity onPress={toggleScheduleVisibility} className="mb-4">
        <View className="flex-row justify-between items-center">
          <Text style={{ color: textColor }} className="text-lg font-bold">Confirmed Schedule</Text>
          <Ionicons name={isScheduleVisible ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color={secondaryTextColor} />
        </View>
      </TouchableOpacity>
      
      {isScheduleVisible && (
        <ScrollView>
          <View className="flex-1">
            {timelineItems.length > 0 ? (
              timelineItems.map((item, index) => {
                if (item.type === 'event') {
                  const group = item.data as Appointment[];
                  return (
                    <TimelineEvent
                      key={index}
                      group={group}
                      showTime={true} // Mostra sempre l'orario per gli eventi
                    />
                  );
                } else {
                  const emptySlot = item.data as { startTime: Date; endTime: Date };
                  return (
                    <View key={index} className="flex-row items-start py-4">
                      <View className="w-20 items-center pt-1">
                        <Text style={{ color: secondaryTextColor }} className="font-medium mb-1">{formatTime(emptySlot.startTime)}</Text>
                        <View className="flex-1 w-0.5" style={{ backgroundColor: cardBorderColor }} />
                        <Text style={{ color: secondaryTextColor }} className="font-medium mt-1">{formatTime(emptySlot.endTime)}</Text>
                      </View>
                      <View className="flex-1 ml-2">
                        <View className="p-4 rounded-lg border" style={{
                          backgroundColor: cardBackgroundColor,
                          borderColor: cardBorderColor
                        }}>
                          <Text style={{ color: secondaryTextColor }} className="italic">No appointments</Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              })
            ) : (
              <View className="items-center justify-center py-10">
                <Text style={{ color: secondaryTextColor }} className="text-2xl">...</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ConfirmedSchedule;
