import { PlaceDTO } from "@/src/dto/response/PlaceDTO";
import { ThemedText } from "../ThemedText";
import { Colors } from '@/constants/Colors';
import { useColorScheme, View, StyleSheet } from "react-native";
import { ThemedIcon } from "../ThemedIcon";

export const ServiceCard: React.FC<{ place: PlaceDTO; iconName: string }> = ({ place, iconName }) => {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];
    const createStyles = (themeColors: typeof Colors.light) => StyleSheet.create({

        serviceCard: {
            width: '48%',
            backgroundColor: themeColors.backgroundMuted,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
        },
        serviceName: {
            fontSize: 14,
            fontWeight: '500',
            marginTop: 8,
            textAlign: 'center',
        },
        serviceDistance: {
            fontSize: 12,
            color: themeColors.tint,
            marginTop: 4,
        },
    });
    const styles = createStyles(themeColors);

    return (
        <View style={styles.serviceCard}>
            <ThemedIcon icon={iconName} size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel={place.name} />
            <ThemedText style={styles.serviceName}>{place.name}</ThemedText>
            <ThemedText style={styles.serviceDistance}>{place.distance}m</ThemedText>
        </View>);
}
