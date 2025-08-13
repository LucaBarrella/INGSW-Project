import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import AnimatedSlideUpPanel from '@/components/common/AnimatedSlideUpPanel';

interface OfferPanelProps {
  isVisible: boolean;
  onClose: () => void;
  propertyAddress: string;
  askingPrice: string;
}

const OfferPanel: React.FC<OfferPanelProps> = ({
  isVisible,
  onClose,
  propertyAddress,
  askingPrice,
}) => {
  const [offerAmount, setOfferAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(false);
  
  // Theme colors
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'propertyCardDetail');
  const brandColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const buttonTextColor = useThemeColor({}, 'buttonTextColor');
  const errorColor = useThemeColor({}, 'error');

  // Validate offer amount
  const validateOfferAmount = (amount: string): boolean => {
    if (!amount || amount.trim() === '') return false;
    
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) return false;
    
    // Check if amount is less than asking price
    const askingPriceNumeric = parseFloat(askingPrice.replace(/[^\d.]/g, ''));
    if (isNaN(askingPriceNumeric)) return false;
    
    return numericAmount < askingPriceNumeric;
  };

  const handleAmountChange = (text: string) => {
    // Normalize the input to handle both comma and period as decimal separators
    const normalizedText = text.replace(',', '.');
    setOfferAmount(normalizedText);
    const isValid = validateOfferAmount(normalizedText);
    setIsValidAmount(isValid);
  };

  const formatCurrency = (value: string): string => {
    // Remove all non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Add thousands separator
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return parts.join(',');
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatedSlideUpPanel
      isVisible={isVisible}
      onClose={onClose}
      initialHeightRatio={0.8}
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
      <View className="flex-1 p-6">
        {/* Title */}
        <ThemedText className="text-2xl font-bold text-center mb-6" style={{ color: textColor }}>
          Make Your Offer
        </ThemedText>

        {/* Property Info Card */}
        <ThemedView 
          className="mb-6 p-4 rounded-xl border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: borderColor,
          }}
        >
          <View className="flex-row items-start gap-3 mb-3">
            <Ionicons name="home-outline" size={20} color={textColor} />
            <View className="flex-1">
              <ThemedText className="font-semibold mb-1" style={{ color: textColor }}>
                Property Address
              </ThemedText>
              <ThemedText className="text-sm" style={{ color: textSecondaryColor }}>
                {propertyAddress}
              </ThemedText>
            </View>
          </View>
          
          <View className="flex-row items-start gap-3">
            <Ionicons name="cash-outline" size={20} color={textColor} />
            <View className="flex-1">
              <ThemedText className="font-semibold mb-1" style={{ color: textColor }}>
                Asking Price
              </ThemedText>
              <ThemedText className="text-sm" style={{ color: textSecondaryColor }}>
                {formatPrice(parseFloat(askingPrice.replace(/[^\d.]/g, '')))}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Offer Amount Input */}
        <View className="mb-4">
          <ThemedText className="font-semibold mb-2" style={{ color: textColor }}>
            Your Offer Amount
          </ThemedText>
          <View className="relative">
            <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <ThemedText className="text-lg font-semibold" style={{ color: textColor }}>
                €
              </ThemedText>
            </View>
            <TextInput
              className={`h-14 rounded-full border text-lg font-medium pr-4 ${
                isValidAmount ? 'border-gray-300' : 'border-red-500'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: textColor,
                paddingLeft: 40,
                paddingRight: 40,
                textAlign: 'center',
                lineHeight: 0,
              }}
              value={formatCurrency(offerAmount)}
              onChangeText={handleAmountChange}
              placeholder="0,00"
              keyboardType="numeric"
              placeholderTextColor={textSecondaryColor}
            />
          </View>
          
          {/* Info Text */}
          <ThemedText className="text-sm mt-2" style={{ color: textSecondaryColor }}>
            Your offer must be below the asking price.
          </ThemedText>
          
          {/* Error Message */}
          {!isValidAmount && offerAmount && (
            <ThemedText className="text-sm mt-1" style={{ color: errorColor }}>
              Please enter a valid amount below the asking price.
            </ThemedText>
          )}
        </View>

        {/* Legal Text */}
        <ThemedText className="text-xs text-center mt-6 mb-8" style={{ color: textSecondaryColor }}>
          By submitting your offer, you agree to our terms and conditions. 
          This is not a binding contract until both parties have accepted.
        </ThemedText>

        {/* Submit Button */}
        <TouchableOpacity
          className="w-full h-14 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isValidAmount ? brandColor : 'rgba(107, 114, 128, 0.5)',
          }}
          disabled={!isValidAmount}
        >
          <ThemedText className="text-base font-bold" style={{ color: buttonTextColor }}>
            {offerAmount ? 'Submit Offer' : 'Enter an Amount'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </AnimatedSlideUpPanel>
  );
};

export default OfferPanel;