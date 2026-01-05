import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AnimatedSlideUpPanel from '../common/AnimatedSlideUpPanel';
import { getMeteoForTheDay, getTimeFromIndex, getEmojiFromMeteoCode } from '../../src/api/OpenMeteoApiService';
import { Ionicons } from '@expo/vector-icons';
import { ThemedIcon } from '@/components/ThemedIcon';
import { useVisits } from '@/src/hooks/useVisits';
import { t } from 'i18next';
import { AvailabilityDTO } from '@/src/dto/response/AvailabilityDTO';

// --- Helper Functions ---
const getDaysInMonth = (date: Date, availabilities: AvailabilityDTO[]) => {
  // Create a Set of available dates for faster lookup, normalized to midnight UTC
  const availableDateStrings = new Set(
    availabilities.map(a => {
      const d = new Date(a.startTime * 1000);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split('T')[0];
    })
  );

  const year = date.getFullYear();
  const month = date.getMonth();
  const numDays = new Date(year, month + 1, 0).getDate();
  const days: Day[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= numDays; i++) {
    const dayDate = new Date(year, month, i);
    dayDate.setHours(0, 0, 0, 0);
    const dateString = dayDate.toISOString().split('T')[0];

    // Only add days that are today or in the future
    const isPastDay = dayDate.getTime() < today.getTime();
    const isAvailable = availableDateStrings.has(dateString);

    if (!isPastDay) {
      days.push({
        date: dayDate,
        dayName: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: i,
        isToday: dayDate.getTime() === today.getTime(),
        isAvailable: isAvailable,
      });
    }
  }
  return days;
};

// --- Interfaces ---
interface VisitSchedulerPanelProps {
  isVisible: boolean;
  onClose: () => void;
  availableDates: AvailabilityDTO[];
  propertyId: number;
  agentId: number;
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
  availableDates,
  propertyId,
  agentId,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [meteo, setMeteo] = useState(new Map());
  const { createVisit } = useVisits();

  // --- Theme Colors ---
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'propertyCardDetail');
  const brandColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const mutedBackgroundColor = useThemeColor({}, 'backgroundMuted');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const disabledColor = useThemeColor({}, 'visitStatusDeleted');
  const [isAgentAvailable, setIsAgentAvailable] = useState<boolean>(true);
  const scrollViewRef = React.useRef<ScrollView>(null);


  // --- Available Times ---
  const availableTimes = () => {
    if (!selectedDay) return [];

    // read available slots for the selected day, get all "half hour" slots from start to end of availability
    const availabilityForTheDay = availableDates.find(ad => { const curr = new Date(ad.startTime * 1000); curr.setHours(0, 0, 0, 0); return curr.getTime() === selectedDay.date.getTime(); });
    if (!availabilityForTheDay) return [];

    const slots: string[] = [];
    const start = new Date(availabilityForTheDay.startTime * 1000);
    const end = new Date(availabilityForTheDay.endTime * 1000);

    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 30)) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
    }

    return slots;
  }

  // --- Effects ---
  useEffect(() => {
    // Only process if we have available dates
    if (availableDates.length === 0) {
      setDays([]);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // When changing months, just update the days for the current month
    // Don't reset currentDate or auto-select
    const isInitialLoad = days.length === 0;

    if (isInitialLoad) {
      // Initial load logic - find first available day
      const firstAvailableDay = availableDates
        .map(a => new Date(a.startTime * 1000).toISOString().split('T')[0])
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime())
        .find(d => d.getTime() >= today.getTime());

      let initialDateToSet = new Date();
      if (firstAvailableDay) {
        initialDateToSet = firstAvailableDay;
      } else {
        initialDateToSet = today;
        setIsAgentAvailable(false);
      }

      setCurrentDate(initialDateToSet);
      setDays(getDaysInMonth(initialDateToSet, availableDates));

      // Auto-select the first available day that is today or in the future
      const dayToAutoSelect = getDaysInMonth(initialDateToSet, availableDates).find(
        day => day.isAvailable && day.date.getTime() >= today.getTime()
      );
      if (dayToAutoSelect) {
        setSelectedDay(dayToAutoSelect);
        handleSelectDay(dayToAutoSelect);
      }
    } else {
      // Month change - just update days for current month
      setDays(getDaysInMonth(currentDate, availableDates));
    }
  }, [availableDates, currentDate]); // Add currentDate to dependencies


  // --- Handlers ---
  const handleVisitConfirmation = () => {
    if (selectedDay && selectedTime) {
      createVisit(propertyId, agentId, selectedDay.date, selectedTime).then((result) => {
        if (result.success !== false) {
          Alert.alert(t('visitRequestedSuccessfully'), t('visitRequestedMessage'));
          onClose();
        } else {
          Alert.alert(t('failedToRequestVisit'), t('pleaseTryAnotherTimeSlot'));
          console.error("Failed to create visit:", result.message);
        }
      });
    }
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment, 1); // Set to day 1 to avoid month skipping issues
      return newDate;
    });
    setSelectedDay(null);
    setSelectedTime(null);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    }, 0);
  };

  const handleSelectDay = (day: Day) => {
    if (day.isAvailable) {
      setSelectedDay(day);
      setSelectedTime(null);
      getMeteoForTheDay(55, 20, day.date).then((meteoInfo) => {
        if (meteoInfo) {
          const mappedMeteo = new Map(Array.from(meteoInfo).map((value, index) => [getTimeFromIndex(index), value]));
          setMeteo(mappedMeteo);
        }
      })
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
      {isAgentAvailable ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4 pb-0">
            <Text style={{ color: textColor }} className="text-2xl font-bold text-center mb-4">{t('scheduleYourVisit')}</Text>

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollViewRef} className="flex-row gap-2 px-4 py-2 -mx-4">
              {days.map((day) => {
                const isSelected = selectedDay?.date.getTime() === day.date.getTime();
                const isDisabled = !day.isAvailable;

                return (
                  <TouchableWithoutFeedback key={day.date.toISOString()} onPress={()=>{}}>
                    <View onStartShouldSetResponder={() => true}>
                      <TouchableOpacity
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
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>

            {/* Time Selector */}
            {selectedDay && (
              <>
                <Text style={{ color: textColor }} className="text-base font-semibold px-4 pt-6 pb-3">{t('availableTimes')}</Text>
                <View className="flex-row flex-wrap justify-between px-4 pb-4">
                  {availableTimes().map(time => {
                    const isSelected = selectedTime === time;
                    return (
                      <TouchableOpacity
                        key={time}
                        onPress={() => setSelectedTime(time)}
                        className="h-10 rounded-full items-center justify-center basis-[48%] mb-3"
                        style={{
                          backgroundColor: isSelected ? brandColor : brandColor + "32",
                          borderColor: isSelected ? brandColor : borderColor,
                          borderWidth: 1,
                          flexDirection: 'row'
                        }}
                      >
                        <ThemedIcon icon={`${getEmojiFromMeteoCode(meteo.get(time))}`} size={38} accessibilityLabel={''}></ThemedIcon>
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
              onPress={handleVisitConfirmation}
            >
              <Text style={{ color: buttonTextColor }} className="text-base font-bold">
                {selectedTime ? t('confirmVisitFor', { time: selectedTime }) : t('selectATimeSlot')}
              </Text>
            </TouchableOpacity>
          </View>
        </>)
        : (
          <View className="flex-1 items-center justify-center p-4">
            <Text style={{ color: textColor }} className="text-xl font-semibold text-center mb-4">
              {t('agentHasNoAvailability')}
            </Text>
            <Text style={{ color: textSecondaryColor }} className="text-center">
              {t('pleaseTryAgainLaterOrContactAgent')}
            </Text>
          </View>
        )}
    </AnimatedSlideUpPanel>
  );
};

export default VisitSchedulerPanel;
