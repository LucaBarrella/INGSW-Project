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
  const agendaHeaderBackgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'tint');
 
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
    <ThemedView className="px-4 py-2">
      <ThemedView className="flex-row justify-between items-center p-4 rounded-2xl shadow-sm" style={{ backgroundColor: agendaHeaderBackgroundColor }}>
        <TouchableOpacity onPress={handlePrevDay} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={iconColor} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCalendarVisible(true)} className="flex-row items-center">
          <Ionicons name="calendar-outline" size={20} color={iconColor} style={{ marginRight: 8 }} />
          <ThemedText type="subtitle" style={{ color: agendaHeaderTextColor, fontWeight: '600' }}>{formatDate(date)}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextDay} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={24} color={iconColor} />
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