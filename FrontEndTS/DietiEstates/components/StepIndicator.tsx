import React from 'react';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export default function StepIndicator({ 
  currentStep, 
  totalSteps, 
  size = 'medium' 
}: StepIndicatorProps) {
  const primary = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  // Determina le classi CSS in base alla dimensione
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: "my-2 gap-3",
          step: "h-2 w-8 rounded-full"
        };
      case 'medium':
        return {
          container: "my-4 gap-4",
          step: "h-3 w-12 rounded-full"
        };
      case 'large':
        return {
          container: "my-5 gap-5",
          step: "h-4 w-16 rounded-full"
        };
      case 'xlarge':
        return {
          container: "my-6 gap-6",
          step: "h-5 w-20 rounded-full"
        };
      default:
        return {
          container: "my-4 gap-4",
          step: "h-3 w-12 rounded-full"
        };
    }
  };

  const { container, step } = getSizeClasses();

  return (
    <View className={`flex-row justify-center items-center ${container}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`${step} ${index + 1 <= currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
          style={{
            backgroundColor: index + 1 <= currentStep ? primary : borderColor
          }}
        />
      ))}
    </View>
  );
}