import { FlatList, TouchableOpacity } from "react-native";
import { PhotonFeature } from "./types";
import { ThemedText } from "@/components/ThemedText";

interface SuggestionsDisplayerProps {
    suggestions: PhotonFeature[];
    onSelectSuggestion: (suggestion: PhotonFeature) => void;
    filterType?: "house" | "city" | "country" | "street" | "state";
}

export const SuggestionsDisplayer: React.FC<SuggestionsDisplayerProps> = ({
    suggestions,
    onSelectSuggestion,
    filterType = undefined
}) => {
    return (
        <FlatList
            data={suggestions.filter(suggestion => {
                if (!filterType) return true;
                return suggestion.properties?.type === filterType;
            })}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => `${item.properties?.osm_id ?? item.label ?? 'suggestion'}-${index}`}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => onSelectSuggestion(item)}
                    className="py-2 px-3 border-b border-gray-100"
                >
                    <ThemedText className="text-sm">{item.label}</ThemedText>
                </TouchableOpacity>
            )}
            style={{ maxHeight: 200 }}
        />
    );
}