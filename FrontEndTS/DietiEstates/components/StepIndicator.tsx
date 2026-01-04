import React from 'react';
import { View, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onStepPress?: (step: number) => void;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  size = 'medium',
  onStepPress
}: StepIndicatorProps) {
  const primary = useThemeColor({}, 'tint');
  const textMuted = useThemeColor({}, 'tabIconDefault');
  const borderColor = useThemeColor({}, 'border');

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return { container: "my-2 gap-2", step: "h-1.5 w-6" };
      case 'medium': return { container: "my-4 gap-3", step: "h-2 w-10" };
      case 'large': return { container: "my-5 gap-4", step: "h-2.5 w-14" };
      default: return { container: "my-4 gap-3", step: "h-2 w-10" };
    }
  };

  const { container, step } = getSizeClasses();

  return (
    <View className={`flex-row justify-center items-center ${container}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index + 1 < currentStep;
        const isActive = index + 1 === currentStep;
        
        return (
          <Pressable
            key={index}
            onPress={() => onStepPress?.(index + 1)}
            className="items-center"
            disabled={!onStepPress}
          >
            <View
              className={`${step} rounded-full overflow-hidden`}
              style={{
                backgroundColor: isCompleted || isActive ? primary : borderColor,
                opacity: isActive ? 1 : isCompleted ? 0.6 : 0.3,
              }}
            />
            {isActive && (
              <View
                className="absolute -bottom-5"
              >
                <View
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: primary }}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}