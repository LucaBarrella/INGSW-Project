import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
 
type AgendaHeaderProps = {
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
};
 
const AgendaHeader: React.FC<AgendaHeaderProps> = ({ currentDate: controlledDate, onCurrentDateChange }) => {
  const [internalDate, setInternalDate] = useState(new Date());
  const date = controlledDate ?? internalDate;
  const agendaHeaderTextColor = useThemeColor({}, 'text');
  const agendaHeaderBackgroundColor = useThemeColor({}, 'backgroundMuted');
 
  const updateDate = (newDate: Date) => {
    if (onCurrentDateChange) {
      onCurrentDateChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  };
 
  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    updateDate(newDate);
  };
 
  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    updateDate(newDate);
  };
 
  const formatDate = (d: Date) => {
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Today, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
 
  return (
    <ThemedView className="p-4">
      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText type="title" style={{ color: agendaHeaderTextColor }}>My Agenda</ThemedText>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={28} color={agendaHeaderTextColor} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView className="flex-row justify-between items-center p-3 rounded-xl" style={{ backgroundColor: agendaHeaderBackgroundColor }}>
        <TouchableOpacity onPress={handlePrevDay}>
          <Ionicons name="chevron-back" size={28} color={agendaHeaderTextColor} />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold" style={{ color: agendaHeaderTextColor }}>{formatDate(date)}</ThemedText>
        <TouchableOpacity onPress={handleNextDay}>
          <Ionicons name="chevron-forward" size={28} color={agendaHeaderTextColor} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};
 
export default AgendaHeader;