import React, { useState, useCallback } from "react";
import { TouchableOpacity, Platform, View, Modal, Pressable } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import ThemedButton from "../ThemedButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from 'expo-haptics';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  maximumDate,
  minimumDate,
  className
}) => {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempDate, setTempDate] = useState(value);

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

  const openPicker = useCallback(async () => {
    await triggerHaptic();
    setTempDate(value);
    setShowPicker(true);
    setIsClosing(false);
  }, [triggerHaptic, value]);

  const closePicker = useCallback(async () => {
    await triggerHaptic();
    setIsClosing(true);
    setTimeout(() => {
      setShowPicker(false);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return;
    
    if (Platform.OS === 'android') {
      onChange(selectedDate);
      setShowPicker(false);
    } else {
      setTempDate(selectedDate);
    }
  };

  const confirmDate = () => {
    closePicker();
    onChange(tempDate);
  };

  if (Platform.OS === 'web') {
    return (
      <View className={className}>
        {label && (
          <ThemedText className="text-xs font-medium mb-1" style={{ color: detailColor }}>
            {label}
          </ThemedText>
        )}
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={(e) => onChange(new Date(e.target.value))}
          className="rounded-md px-3 py-1.5 w-full"
          style={{
            backgroundColor: background,
            color: text,
            borderWidth: 1,
            borderColor: borderColor
          }}
        />
      </View>
    );
  }

  return (
    <View className={className}>
      {label && (
        <ThemedText className="text-xs font-medium mb-1" style={{ color: detailColor }}>
          {label}
        </ThemedText>
      )}
      
      <TouchableOpacity
        onPress={openPicker}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={t("selectDate")}
        className="rounded-md px-3 py-1.5 w-full active:opacity-70"
        style={{
          backgroundColor: background,
          borderWidth: 1,
          borderColor: borderColor
        }}
      >
        <ThemedText className="text-sm" style={{ color: text }}>
          {formatDate(value)}
        </ThemedText>
      </TouchableOpacity>

      {showPicker && (
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
                {t("selectDate")}
              </ThemedText>
              <View className={Platform.select({ ios: 'rounded-lg p-1', android: '' })}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={tempDate}
                  mode="date"
                  display={Platform.select({
                    ios: 'inline',
                    android: 'default',
                    default: 'spinner'
                  })}
                  onChange={handleDateChange}
                  maximumDate={maximumDate}
                  minimumDate={minimumDate}
                  textColor={text}
                  style={Platform.select({
                    ios: {
                      transform: [{ scale: 0.8 }]
                    },
                    default: {}
                  })}
                />
              </View>
              {Platform.OS === 'ios' && (
                <ThemedButton
                  title={t("confirm")}
                  onPress={confirmDate}
                  className="w-full min-h-[40px] mt-3"
                />
              )}
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};