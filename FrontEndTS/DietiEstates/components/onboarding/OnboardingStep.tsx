import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ImageSourcePropType, useColorScheme } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = {
  imageSource: ImageSourcePropType;
  title: string;
  description: string;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  secondary?: React.ReactNode;
  showPager?: React.ReactNode;
};

export default function OnboardingStep({
  imageSource,
  title,
  description,
  primaryLabel,
  onPrimaryPress,
  secondary,
  showPager,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const buttonBg = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonTextColor');
  const titleColor = useThemeColor({}, 'text');
  // Use 'tint' as description color to follow theme contrast
  const descriptionColor = useThemeColor({}, 'tint');

  return (
    <View className="flex-1">
      <ImageBackground source={imageSource} className="flex-1 w-full h-full" resizeMode="cover">
        <View className="flex-1 px-6 py-20 justify-between items-center" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }}>
          <View className="w-full items-center mt-12">
            <Text className="text-3xl font-extrabold text-center mb-3" style={{ color: titleColor }}>
              {title}
            </Text>
            <Text className="text-lg text-center leading-7" style={{ color: descriptionColor }}>
              {description}
            </Text>
          </View>

          <View className="w-full items-center space-y-3">
            {showPager ? <View className="mb-2">{showPager}</View> : null}
            {secondary ? <View>{secondary}</View> : null}
            {primaryLabel ? (
              <TouchableOpacity
                className="w-full py-5 rounded-md items-center"
                onPress={onPrimaryPress}
                style={{ backgroundColor: buttonBg }}
              >
                <Text style={{ color: buttonText, fontWeight: '700' }}>{primaryLabel}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}