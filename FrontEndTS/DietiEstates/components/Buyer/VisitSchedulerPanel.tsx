import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import AnimatedSlideUpPanel from '../common/AnimatedSlideUpPanel';

// --- Helper Functions ---
const getDaysInMonth = (date: Date, availableDates: string[]) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();
  const days: Day[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

  for (let i = 1; i <= numDays; i++) {
    const dayDate = new Date(year, month, i);
    dayDate.setHours(0, 0, 0, 0); // Normalize dayDate
    const dateString = dayDate.toISOString().split('T')[0];

    // Only add days that are today or in the future AND are available
    if (dayDate.getTime() >= today.getTime() && availableDates.includes(dateString)) {
      days.push({
        date: dayDate,
        dayName: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: i,
        isToday: dayDate.getTime() === today.getTime(),
        isAvailable: true, // Already filtered by availableDates and future
      });
    }
  }
  return days;
};

// --- Mock Data ---
const MOCK_AVAILABLE_DATES = [
    "2025-08-05", "2025-08-06", "2025-08-07", "2025-08-08",
    "2025-08-11", "2025-08-12", "2025-08-13", "2025-08-18", "2025-08-19",
    "2025-09-02", "2025-09-03",
];
const availableTimes = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '14:00', '14:30'
];

// --- Interfaces ---
interface VisitSchedulerPanelProps {
  isVisible: boolean;
  onClose: () => void;
  availableDates?: string[];
}

interface Day {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isAvailable: boolean;
}

// --- Main Component ---
const VisitSchedulerPanel: React.FC<VisitSchedulerPanelProps> = ({
  isVisible,
  onClose,
  availableDates = MOCK_AVAILABLE_DATES,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);


  // --- Theme Colors ---
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'propertyCardDetail');
  const brandColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const mutedBackgroundColor = useThemeColor({}, 'backgroundMuted');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const disabledColor = useThemeColor({}, 'visitStatusDeleted');

  // --- Effects ---
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Trova la prima data disponibile da domani in poi
    const firstAvailableDay = availableDates
      .map(d => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime()) // Ordina per assicurarsi di ottenere il più presto
      .find(d => new Date(d).getTime() > today.getTime()); // Trova la prima data strettamente dopo oggi

    let initialDateToSet = new Date();
    if (firstAvailableDay) {
      initialDateToSet = firstAvailableDay;
    } else {
      // Se non ci sono date future disponibili, imposta la data corrente
      initialDateToSet = today;
    }

    setCurrentDate(initialDateToSet);
    const updatedDays = getDaysInMonth(initialDateToSet, availableDates);
    setDays(updatedDays);
    
    // Autoseleziona il primo giorno disponibile che non sia nel passato
    const dayToAutoSelect = updatedDays.find(day => day.isAvailable && day.date.getTime() >= today.getTime());
    if (dayToAutoSelect) {
      setSelectedDay(dayToAutoSelect);
    }
  }, [availableDates]);

  
  useEffect(() => {
      setDays(getDaysInMonth(currentDate, availableDates));
  }, [currentDate, availableDates]);


  // --- Handlers ---
  const handleMonthChange = (increment: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment, 1); // Set to day 1 to avoid month skipping issues
      return newDate;
    });
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleSelectDay = (day: Day) => {
    if (day.isAvailable) {
      setSelectedDay(day);
      setSelectedTime(null);
    }
  };


  // --- Render ---
  return (
    <AnimatedSlideUpPanel
      isVisible={isVisible}
      onClose={onClose}
      initialHeightRatio={0.85}
      panelStyle={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: textColor,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4 pb-0">
        <Text style={{ color: textColor }} className="text-2xl font-bold text-center mb-4">Schedule Your Visit</Text>

        {/* Month Selector */}
        <View className="flex-row items-center justify-between px-2 py-2">
          <TouchableOpacity onPress={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <Ionicons name="chevron-back" size={24} color={textSecondaryColor} />
          </TouchableOpacity>
          <Text style={{ color: textColor }} className="text-lg font-bold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100">
            <Ionicons name="chevron-forward" size={24} color={textSecondaryColor} />
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 px-4 py-2 -mx-4">
          {days.map((day) => {
            const isSelected = selectedDay?.date.getTime() === day.date.getTime();
            // isPastDay is no longer needed here as getDaysInMonth already filters past days
            const isDisabled = !day.isAvailable;

            return (
              <TouchableOpacity
                key={day.date.toISOString()}
                onPress={() => handleSelectDay(day)}
                disabled={isDisabled}
                className="flex flex-col items-center justify-center gap-1.5 h-20 w-14 shrink-0 rounded-xl p-2"
                style={{
                  backgroundColor: isSelected ? brandColor : (day.isToday && !isSelected ? mutedBackgroundColor : 'transparent'),
                  borderColor: day.isToday && !isSelected ? brandColor : 'transparent',
                  borderWidth: 1,
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                <Text style={{ color: isSelected ? buttonTextColor : (day.isToday && !isSelected ? brandColor : textColor) }} className="text-sm font-medium">
                  {day.dayName}
                </Text>
                <Text style={{ color: isSelected ? buttonTextColor : (day.isToday && !isSelected ? brandColor : textColor) }} className="text-lg font-bold">
                  {day.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Selector */}
        {selectedDay && (
          <>
            <Text style={{ color: textColor }} className="text-base font-semibold px-4 pt-6 pb-3">Available Times</Text>
            <View className="flex-row flex-wrap justify-between px-4 pb-4">
              {availableTimes.map(time => {
                const isSelected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    className="h-10 rounded-full items-center justify-center basis-[48%] mb-3"
                    style={{
                      backgroundColor: isSelected ? brandColor : 'transparent',
                      borderColor: isSelected ? brandColor : borderColor,
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: isSelected ? buttonTextColor : textColor, fontWeight: isSelected ? 'bold' : 'normal' }}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={{ backgroundColor, borderTopColor: borderColor }} className="sticky bottom-0 p-4 pt-2 border-t mb-8">
        <TouchableOpacity
          disabled={!selectedDay || !selectedTime}
          className="w-full h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: (!selectedDay || !selectedTime) ? disabledColor : brandColor }}
        >
          <Text style={{ color: buttonTextColor }} className="text-base font-bold">
            {selectedTime ? `Confirm Visit for ${selectedTime}` : 'Select a time slot'}
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedSlideUpPanel>
  );
};

export default VisitSchedulerPanel;
