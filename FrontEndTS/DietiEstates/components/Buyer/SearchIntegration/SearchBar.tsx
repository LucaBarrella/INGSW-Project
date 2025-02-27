import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBarProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search properties...',
  activeFiltersCount = 0,
}) => {
  const textColor = useThemeColor({}, 'text');
  const buttonBackground = useThemeColor({}, 'loginCardBackground');
  const buttonTextColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'tabIconDefault');
  const borderColor = useThemeColor({}, 'border');

  return (
    <ThemedView className="w-full px-4 py-2">
      <ThemedView 
        className="flex-row items-center bg-white rounded-2xl shadow-sm overflow-hidden"
        style={{ borderColor, borderWidth: 1 }}
      >
        {/* Search section with subtle background */}
        <View className="flex-1 flex-row items-center bg-gray-50/30">
          <View className="pl-5 pr-3 py-3">
            <Ionicons 
              name="search" 
              size={20} 
              color={iconColor}
            />
          </View>
          
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            className="flex-1 h-12 text-base"
            style={{ color: textColor }}
            placeholderTextColor={iconColor}
          />
        </View>

        {/* Filter button */}
        <View className="p-2">
          <TouchableOpacity
            onPress={onFilterPress}
            className="relative flex-row items-center px-4 h-10 rounded-xl shadow-sm"
            style={{ backgroundColor: buttonBackground }}
          >
            <Ionicons 
              name="funnel" 
              size={16} 
              color={buttonTextColor}
              className="mr-2"
            />
            <ThemedText 
              className="font-medium text-sm"
              style={{ color: buttonTextColor }}
            >
              Filters
            </ThemedText>
            
            {/* Badge */}
            {activeFiltersCount > 0 && (
              <View 
                className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 bg-white rounded-full items-center justify-center px-1.5"
                style={{ borderColor, borderWidth: 1 }}
              >
                <ThemedText 
                  className="text-xs font-bold"
                  style={{ color: buttonTextColor }}
                >
                  {activeFiltersCount}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
};
