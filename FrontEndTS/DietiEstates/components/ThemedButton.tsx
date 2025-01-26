import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

interface ThemedButtonProps extends TouchableOpacityProps {
    title?: string;
    lightColor?: string;
    darkColor?: string;
    fontSize?: number;
    borderRadius?: number;
    className?: string;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({ title, lightColor, darkColor, fontSize = 16, borderRadius = 25, className, style, ...props }) => {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonBackground');
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonTextColor');

    return (
        <TouchableOpacity
            style={[{ backgroundColor, borderRadius: borderRadius }, style]}
            className={`py-2 items-center justify-center mb-4 ${className}`}
            {...props}
        >
            <ThemedText style={{ color: textColor, fontSize }}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default ThemedButton;