import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

interface ThemedButtonProps extends TouchableOpacityProps {
    title?: string;
    lightColor?: string; // For background
    darkColor?: string;  // For background
    textColor?: string; // Specific text color override
    fontSize?: number;
    borderRadius?: number;
    className?: string;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
    title,
    lightColor,          // For background
    darkColor,           // For background
    textColor: propTextColor, // Specific text color override
    fontSize = 16,
    borderRadius = 25,
    className,
    style,
    ...props
}) => {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonBackground');

    // Determine the text color.
    // If propTextColor is provided, it will be used.
    // Otherwise, defaultButtonTextColor is used, which is fetched from the theme's 'buttonTextColor'
    // without being influenced by the component's lightColor/darkColor props (intended for background).
    const defaultButtonTextColor = useThemeColor({}, 'buttonTextColor');
    const finalTextColor = propTextColor || defaultButtonTextColor;

    return (
        <TouchableOpacity
            style={[{ backgroundColor, borderRadius: borderRadius }, style]}
            className={`py-2 items-center justify-center mb-4 ${className}`}
            {...props}
        >
            <ThemedText style={{ color: finalTextColor, fontSize }}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default ThemedButton;