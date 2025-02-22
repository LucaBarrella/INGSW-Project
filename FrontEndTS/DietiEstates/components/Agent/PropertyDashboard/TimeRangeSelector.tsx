import React, { useState, useEffect, useCallback } from "react";
import { TouchableOpacity, Platform, View, Modal, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from 'expo-haptics';

interface TimeRangeSelectorProps {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  defaultStartDate,
  defaultEndDate,
  onDateChange,
}) => {
  const { t } = useTranslation();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [startDate, setStartDate] = useState(() => {
    const date = defaultStartDate || new Date(2024, 0, 1);
    console.log('Initial start date:', date.toISOString());
    return date;
  });
  
  const [endDate, setEndDate] = useState(() => {
    const date = defaultEndDate || new Date(2024, 11, 31);
    console.log('Initial end date:', date.toISOString());
    return date;
  });

  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const background = useThemeColor({}, 'propertyCardBackground');
  const text = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const detailColor = useThemeColor({}, 'propertyCardDetail');
  const modalBg = useThemeColor({}, 'background');

  useEffect(() => {
    console.log('Initial TimeRangeSelector mount, calling onDateChange with:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    onDateChange(startDate, endDate);
  }, []); 

  const triggerHaptic = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not available');
    }
  }, []);

  const openPicker = useCallback(async (isStart: boolean) => {
    await triggerHaptic();
    if (isStart) {
      setShowEndPicker(false);
      setShowStartPicker(true);
    } else {
      setShowStartPicker(false);
      setShowEndPicker(true);
    }
    setIsClosing(false);
  }, [triggerHaptic]);

  const closePicker = useCallback(async () => {
    await triggerHaptic();
    setIsClosing(true);
    setTimeout(() => {
      setShowStartPicker(false);
      setShowEndPicker(false);
      setIsClosing(false);
    }, 100);
  }, [triggerHaptic]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const validateDateRange = (newStart: Date, newEnd: Date) => {
    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.log('Invalid date detected:', { newStart, newEnd });
      return false;
    }
    if (newStart > newEnd) {
      console.log('Start date is after end date:', { newStart, newEnd });
      return false;
    }
    return true;
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    console.log('handleStartDateChange:', { event: event?.type, selectedDate });
    
    if (!selectedDate || event?.type === 'dismissed') {
      if (Platform.OS === 'ios') closePicker();
      return;
    }
    
    if (validateDateRange(selectedDate, endDate)) {
      setTempStartDate(selectedDate);
      if (Platform.OS === 'android') {
        closePicker();
        setStartDate(selectedDate);
        onDateChange(selectedDate, endDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    console.log('handleEndDateChange:', { event: event?.type, selectedDate });
    
    if (!selectedDate || event?.type === 'dismissed') {
      if (Platform.OS === 'ios') closePicker();
      return;
    }

    if (validateDateRange(startDate, selectedDate)) {
      setTempEndDate(selectedDate);
      if (Platform.OS === 'android') {
        closePicker();
        setEndDate(selectedDate);
        onDateChange(startDate, selectedDate);
      }
    }
  };

  const confirmStartDate = () => {
    console.log('Confirming start date:', tempStartDate.toISOString());
    closePicker();
    setStartDate(tempStartDate);
    onDateChange(tempStartDate, endDate);
  };

  const confirmEndDate = () => {
    console.log('Confirming end date:', tempEndDate.toISOString());
    closePicker();
    setEndDate(tempEndDate);
    onDateChange(startDate, tempEndDate);
  };

  return (
    <ThemedView 
      className="rounded-md p-2"
      style={{
        backgroundColor: background,
        borderWidth: 1,
        borderColor: borderColor
      }}
    >
      <View className="flex-row gap-2 items-center justify-center">
        <View>
          <ThemedText className="text-xs font-medium mb-1" style={{ color: detailColor }}>
            {t("startDate")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => openPicker(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t("selectStartDate")}
            accessibilityHint={t("tapToSelectStartDate")}
            className="rounded-md px-3 py-1.5 w-[140px] active:opacity-70"
            style={{ 
              backgroundColor: background,
              borderWidth: 1,
              borderColor: borderColor 
            }}
          >
            <ThemedText className="text-sm" style={{ color: text }}>
              {formatDate(startDate)}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View>
          <ThemedText className="text-xs font-medium mb-1" style={{ color: detailColor }}>
            {t("endDate")}
          </ThemedText>
          <TouchableOpacity
            onPress={() => openPicker(false)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t("selectEndDate")}
            accessibilityHint={t("tapToSelectEndDate")}
            className="rounded-md px-3 py-1.5 w-[140px] active:opacity-70"
            style={{ 
              backgroundColor: background,
              borderWidth: 1,
              borderColor: borderColor 
            }}
          >
            <ThemedText className="text-sm" style={{ color: text }}>
              {formatDate(endDate)}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {(showStartPicker || showEndPicker) && Platform.OS === 'web' && (
        <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderColor: borderColor }}>
          <input
            type="date"
            value={(showStartPicker ? tempStartDate : tempEndDate).toISOString().split('T')[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              console.log('Web date changed:', date.toISOString());
              if (showStartPicker) {
                handleStartDateChange(null, date);
                closePicker();
              } else {
                handleEndDateChange(null, date);
                closePicker();
              }
            }}
            className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{
              borderWidth: 1,
              borderColor: borderColor,
              backgroundColor: background,
              color: text
            }}
            aria-label={t(showStartPicker ? "selectStartDate" : "selectEndDate")}
            min="2024-01-01"
            max="2024-12-31"
          />
        </View>
      )}
      
      {(showStartPicker || showEndPicker) && Platform.OS !== 'web' && (
        <Modal
          transparent={true}
          visible={true}
          animationType={isClosing ? "none" : "fade"}
          onRequestClose={closePicker}
        >
          <Pressable 
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={closePicker}
          >
            <Pressable 
              className="rounded-lg p-3 w-96 items-center shadow-xl"
              style={{
                backgroundColor: modalBg,
                transform: [{ translateY: isClosing ? 20 : 0 }],
                opacity: isClosing ? 0 : 1
              }}
              onPress={e => e.stopPropagation()}
            >
              <ThemedText className="text-sm font-medium mb-2" style={{ color: text }}>
                {t(showStartPicker ? "selectStartDate" : "selectEndDate")}
              </ThemedText>
              <View className={Platform.select({ ios: 'rounded-lg p-1', android: '' })}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={showStartPicker ? tempStartDate : tempEndDate}
                  mode="date"
                  display={Platform.select({
                    ios: 'inline',
                    android: 'default',
                    default: 'spinner'
                  })}
                  onChange={showStartPicker ? handleStartDateChange : handleEndDateChange}
                  maximumDate={showStartPicker ? endDate : new Date(2024, 11, 31)}
                  minimumDate={showStartPicker ? new Date(2024, 0, 1) : startDate}
                  textColor={text}
                  style={Platform.select({
                    ios: {
                      transform: [{ scale: 0.8 }]
                    },
                    default: {}
                  })}
                />
              </View>
              <ThemedButton
                title={t("confirm")}
                onPress={showStartPicker ? confirmStartDate : confirmEndDate}
                className="w-full min-h-[40px] mt-3"
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </ThemedView>
  );
};
