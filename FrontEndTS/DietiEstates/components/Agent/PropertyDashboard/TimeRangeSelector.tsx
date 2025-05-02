import React, { useState, useCallback } from "react";
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
      setTempStartDate(startDate);
      setShowEndPicker(false);
      setShowStartPicker(true);
    } else {
      setTempEndDate(endDate);
      setShowStartPicker(false);
      setShowEndPicker(true);
    }
    setIsClosing(false);
  }, [triggerHaptic, startDate, endDate]);

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
    return true;
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    console.log('handleStartDateChange:', { event: event?.type, selectedDate });

    if (!selectedDate || (event?.type === 'dismissed' && Platform.OS === 'ios')) {
      return;
    }
    if (!selectedDate || (event?.type === 'dismissed' && Platform.OS === 'android')) {
      setShowStartPicker(false);
      return;
    }

    const needsEndDateUpdate = selectedDate > endDate;
    const newEndDate = needsEndDateUpdate ? new Date(selectedDate.getTime() + 86400000) : endDate;

    if (validateDateRange(selectedDate, needsEndDateUpdate ? newEndDate : endDate)) {
      setTempStartDate(selectedDate);
      if (needsEndDateUpdate) {
        setTempEndDate(newEndDate);
      }

      if (Platform.OS === 'android') {
        setStartDate(selectedDate);
        if (needsEndDateUpdate) {
          setEndDate(newEndDate);
          onDateChange(selectedDate, newEndDate);
        } else {
          onDateChange(selectedDate, endDate);
        }
        setShowStartPicker(false);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    console.log('handleEndDateChange:', { event: event?.type, selectedDate });

    if (!selectedDate || (event?.type === 'dismissed' && Platform.OS === 'ios')) {
      return;
    }
    if (!selectedDate || (event?.type === 'dismissed' && Platform.OS === 'android')) {
      setShowEndPicker(false);
      return;
    }

    const needsStartDateUpdate = selectedDate < startDate;
    const newStartDate = needsStartDateUpdate ? new Date(selectedDate.getTime() - 86400000) : startDate;

    if (validateDateRange(needsStartDateUpdate ? newStartDate : startDate, selectedDate)) {
      setTempEndDate(selectedDate);
      if (needsStartDateUpdate) {
        setTempStartDate(newStartDate);
      }

      if (Platform.OS === 'android') {
        setEndDate(selectedDate);
        if (needsStartDateUpdate) {
          setStartDate(newStartDate);
          onDateChange(newStartDate, selectedDate);
        } else {
          onDateChange(startDate, selectedDate);
        }
        setShowEndPicker(false);
      }
    }
  };

  const confirmStartDate = () => {
    console.log('Confirming start date:', tempStartDate.toISOString());
    closePicker();

    if (tempStartDate > endDate) {
      const newEndDate = new Date(tempStartDate.getTime() + 86400000);
      setStartDate(tempStartDate);
      setEndDate(newEndDate);
      onDateChange(tempStartDate, newEndDate);
    } else {
      setStartDate(tempStartDate);
      onDateChange(tempStartDate, endDate);
    }
  };

  const confirmEndDate = () => {
    console.log('Confirming end date:', tempEndDate.toISOString());
    closePicker();

    if (tempEndDate < startDate) {
      const newStartDate = new Date(tempEndDate.getTime() - 86400000);
      setEndDate(tempEndDate);
      setStartDate(newStartDate);
      onDateChange(newStartDate, tempEndDate);
    } else {
      setEndDate(tempEndDate);
      onDateChange(startDate, tempEndDate);
    }
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
                  maximumDate={new Date(2024, 11, 31)}
                  minimumDate={new Date(2024, 0, 1)}
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
