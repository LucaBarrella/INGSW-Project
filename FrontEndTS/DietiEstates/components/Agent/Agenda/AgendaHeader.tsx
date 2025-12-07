import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
 
type AgendaHeaderProps = {
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
};
 
const AgendaHeader: React.FC<AgendaHeaderProps> = ({ currentDate: controlledDate, onCurrentDateChange }) => {
  const { t, i18n } = useTranslation();
  const [internalDate, setInternalDate] = useState(new Date());
  const date = controlledDate ?? internalDate;
  const [isCalendarVisible, setCalendarVisible] = useState(false);
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
 
  const capitalize = (value: string) => {
    if (!value) return value;
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  };

  const getDateParts = (target: Date) => {
    const locale = i18n.language || 'it-IT';
    const parts = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(target);
    const day = parts.find((part) => part.type === 'day')?.value ?? '';
    const month = capitalize(parts.find((part) => part.type === 'month')?.value ?? '');
    const weekday = capitalize(parts.find((part) => part.type === 'weekday')?.value ?? '');
    return { day, month, weekday };
  };

  const formatDate = (d: Date) => {
    const today = new Date();
    const { day, month, weekday } = getDateParts(d);
    const dayMonthString = `${day} ${month}`;
    if (d.toDateString() === today.toDateString()) {
      return t('agenda.today', { date: dayMonthString });
    }
    return t('agenda.dateShort', { date: `${weekday}, ${dayMonthString}` });
  };
 
  return (
    <ThemedView className="p-4">
      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText type="title" style={{ color: agendaHeaderTextColor, lineHeight: 36}}>{t('agenda.title')}</ThemedText>
        <TouchableOpacity onPress={() => setCalendarVisible(true)}>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCalendarVisible}
          onRequestClose={() => {
            setCalendarVisible(!isCalendarVisible);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
              <Calendar
                current={date.toISOString().split('T')[0]}
                onDayPress={(day) => {
                  updateDate(new Date(day.timestamp));
                  setCalendarVisible(false);
                }}
                monthFormat={'MMMM yyyy'}
                hideExtraDays={true}
                firstDay={1}
              />
            </View>
          </View>
        </Modal>
      </ThemedView>
    </ThemedView>
  );
};
 
export default AgendaHeader;