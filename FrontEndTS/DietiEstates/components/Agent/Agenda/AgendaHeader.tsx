import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

const AgendaHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const agendaHeaderTextColor = useThemeColor({}, 'text');
  const agendaHeaderBackgroundColor = useThemeColor({}, 'backgroundMuted');

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
        <ThemedText type="defaultSemiBold" style={{ color: agendaHeaderTextColor }}>{formatDate(currentDate)}</ThemedText>
        <TouchableOpacity onPress={handleNextDay}>
          <Ionicons name="chevron-forward" size={28} color={agendaHeaderTextColor} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default AgendaHeader;