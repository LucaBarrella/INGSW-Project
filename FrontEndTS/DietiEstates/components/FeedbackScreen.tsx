import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedIcon } from '@/components/ThemedIcon';
import ThemedButton from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';

type FeedbackStatus = 'success' | 'error' | 'info';

interface FeedbackScreenProps {
  status: FeedbackStatus;
  title: string;
  message: string;
  buttonLabel: string;
  onButtonPress: () => void;
  iconName?: string; // Optional specific icon name
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  status,
  title,
  message,
  buttonLabel,
  onButtonPress,
  iconName,
}) => {
  const successColor = useThemeColor({}, 'success'); // Da aggiungere a Color.ts, per entambe le modalità
  const errorColor = useThemeColor({}, 'error');
  const infoColor = useThemeColor({}, 'info'); // same as above

  let currentIconName: string;
  let currentIconColor: string;

  switch (status) {
    case 'success':
      currentIconName = iconName || 'material-symbols:check-circle-outline';
      currentIconColor = successColor;
      break;
    case 'error':
      currentIconName = iconName || 'material-symbols:error-outline';
      currentIconColor = errorColor;
      break;
    case 'info':
    default:
      currentIconName = iconName || 'material-symbols:info-outline';
      currentIconColor = infoColor;
      break;
  }

  return (
    <ThemedView className="flex-1 items-center justify-center p-8">
      {/* Icon */}
      <ThemedIcon
        icon={currentIconName}
        size={80} // Large icon
        style={{ marginBottom: 24 }}
        lightColor={currentIconColor} // Use theme hook for consistency if needed
        darkColor={currentIconColor}
        accessibilityLabel={title} // Add accessibility label
      />
      {/* Title */}
      <ThemedText type="title" className="text-center mb-2 p-1">
        {title}
      </ThemedText>

      {/* Message */}
      <ThemedText type="default" className="text-center mb-8">
        {message}
      </ThemedText>

      {/* Action Button */}
      <ThemedButton
        title={buttonLabel}
        onPress={onButtonPress}
        className="w-full" // Make button full width
      />
    </ThemedView>
  );
};

export default FeedbackScreen;