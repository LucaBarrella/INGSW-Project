import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
// useSearch and dispatch are no longer needed here
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SearchBarProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  onSearchPress, // Added this prop
  placeholder = 'Search properties...',
  activeFiltersCount = 0,
}) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'propertyCardBackground');
  const accentColor = useThemeColor({}, 'buttonBackground');

  // Removed useSearch hook

  const handleSubmit = () => {
    console.log('[SearchBar] handleSubmit called. Query:', value);
    // The query is already updated in the context by SearchAndFilter via onChangeText.
    // This handler is now primarily for triggering navigation or other actions on explicit search submission.
    if (onSearchPress) {
      console.log('[SearchBar] Calling onSearchPress');
      onSearchPress();
    }
  };

  return (
    <ThemedView className="w-full px-6 py-4">
      <ThemedView className="flex-row items-center bg-white rounded-2xl shadow-sm py-6 px-4" style={{ backgroundColor}}>
        {/* Search section with subtle background */}
        <View className="flex-1 flex-row items-center justify-between">
          <ThemedView className="flex-row items-center flex-1 rounded-2xl bg-gray-100">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!value.trim()}
              className="pl-5 pr-3 py-3"
            >
              <Ionicons
                name="search"
                size={20}
                color={value.trim() ? accentColor : textColor}
              />
            </TouchableOpacity>
            
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              className="flex-1 text-base leading-5 h-5 p-0"
              style={{ color: textColor }}
              placeholderTextColor={textColor}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </ThemedView>

          {/* Filter button - now inside the search section */}
          <View className="ml-4">
            <TouchableOpacity
              onPress={onFilterPress}
              className="relative flex-row items-center px-4 h-10 rounded-2xl"
              style={{ backgroundColor: useThemeColor({}, 'buttonBackground') }}
            >
              <Ionicons 
                name="funnel" 
                size={16} 
                color={useThemeColor({}, 'buttonTextColor')}
                className="mr-1"
              />
              <ThemedText 
                className="font-medium text-sm"
                style={{ color: useThemeColor({}, 'buttonTextColor') }}
              >
                Filters
              </ThemedText>
              
              {/* Badge */}
              {activeFiltersCount > 0 && (
                <ThemedView className="absolute -top-2 -right-2 min-w-[18px] h-5 bg-white rounded-full border border-gray-200 items-center justify-center px-1">
                  <ThemedText 
                    className="text-xs font-bold leading-tight"
                  >
                    {activeFiltersCount}
                  </ThemedText>
                </ThemedView>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

