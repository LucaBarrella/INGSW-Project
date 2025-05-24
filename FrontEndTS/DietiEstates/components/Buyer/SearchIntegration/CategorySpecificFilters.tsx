import React from "react";
import { View, Switch, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { 
  PropertyFilters, 
  CategorySpecificFiltersProps,
  RESIDENTIAL_CATEGORIES,
  COMMERCIAL_CATEGORIES,
  INDUSTRIAL_CATEGORIES,
  LAND_CATEGORIES
} from "./types";
import { QuickNumericSelector } from './QuickNumericSelector';

const STRUCTURE_TYPES = ["Cemento Armato", "Acciaio", "Mista"] as const;
type StructureType = typeof STRUCTURE_TYPES[number];

export const CategorySpecificFilters: React.FC<CategorySpecificFiltersProps> = ({
  category, // Ora è keyof Omit<PropertyFilters, "general">
  filters,
  onUpdateFilters, // Ora si aspetta { category: keyof Omit<PropertyFilters, "general">; newFilters: Partial<PropertyFilters[keyof Omit<PropertyFilters, "general">]>; }
  onBackToCategories,
}) => {
  const textColor = useThemeColor({}, "text");
  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonTextColor = useThemeColor({}, "buttonTextColor");
  const loginCardBackground = useThemeColor({}, "loginCardBackground");
  const tintColor = useThemeColor({}, "tint");

  const renderCategoryButton = (type: string, isSelected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={type}
      onPress={onPress}
      className="px-3 py-2 rounded-full mb-2 mr-2"
      style={{
        backgroundColor: isSelected ? buttonBackground : loginCardBackground,
      }}
    >
      <ThemedText
        style={{
          color: isSelected ? buttonTextColor : textColor,
        }}
      >
        {type}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderResidentialFilters = () => (
    <>
      <TouchableOpacity 
        onPress={onBackToCategories}
        className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg"
        style={{ backgroundColor: loginCardBackground }}
      >
        <Ionicons name="swap-horizontal" size={20} color={tintColor} />
        <ThemedText style={{ color: tintColor, marginLeft: 4 }}>
          Cambia Categoria
        </ThemedText>
      </TouchableOpacity>

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Tipo
        </ThemedText>
        <View className="flex-row flex-wrap">
          {RESIDENTIAL_CATEGORIES.map((type) => 
            renderCategoryButton(
              type,
              filters.residential.category === type,
              () => onUpdateFilters({
                category: 'residential',
                newFilters: { category: type },
              })
            )
          )}
        </View>
      </ThemedView>

      <QuickNumericSelector
        label="Camere da letto"
        value={filters.residential.rooms}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'residential',
            newFilters: { rooms: value },
          })
        }
        maxValue={10}
        minValue={1}
      />
      
      <QuickNumericSelector
        label="Bagni"
        value={filters.residential.bathrooms}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'residential',
            newFilters: { bathrooms: value },
          })
        }
        maxValue={6}
        minValue={1}
      />

      <QuickNumericSelector
        label="Piano"
        value={filters.residential.floor}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'residential',
            newFilters: { floor: value },
          })
        }
        maxValue={50}
        minValue={0}
      />

      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText style={{ color: textColor }}>Ascensore</ThemedText>
        <Switch
          value={filters.residential.elevator}
          onValueChange={(value: boolean) =>
            onUpdateFilters({
              category: 'residential',
              newFilters: { elevator: value },
            })
          }
        />
      </ThemedView>

      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText style={{ color: textColor }}>Piscina</ThemedText>
        <Switch
          value={filters.residential.pool}
          onValueChange={(value: boolean) =>
            onUpdateFilters({
              category: 'residential',
              newFilters: { pool: value },
            })
          }
        />
      </ThemedView>
    </>
  );

  const renderCommercialFilters = () => (
    <>
      <TouchableOpacity 
        onPress={onBackToCategories}
        className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg"
        style={{ backgroundColor: loginCardBackground }}
      >
        <Ionicons name="swap-horizontal" size={20} color={tintColor} />
        <ThemedText style={{ color: tintColor, marginLeft: 4 }}>
          Cambia Categoria
        </ThemedText>
      </TouchableOpacity>

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Tipo
        </ThemedText>
        <View className="flex-row flex-wrap">
          {COMMERCIAL_CATEGORIES.map((type) =>
            renderCategoryButton(
              type,
              filters.commercial.category === type,
              () => onUpdateFilters({
                category: 'commercial',
                newFilters: { category: type },
              })
            )
          )}
        </View>
      </ThemedView>

      <QuickNumericSelector
        label="Bagni"
        value={filters.commercial.bathrooms}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'commercial',
            newFilters: { bathrooms: value },
          })
        }
        maxValue={6}
        minValue={1}
      />

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Data di Costruzione
        </ThemedText>
        <QuickNumericSelector
          label="Anno"
          value={filters.commercial.constructionDate}
          onValueChange={(value: string) =>
            onUpdateFilters({
              category: 'commercial',
              newFilters: { constructionDate: value },
            })
          }
          maxValue={new Date().getFullYear()}
          minValue={1800}
        />
      </ThemedView>

      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText style={{ color: textColor }}>Uscita di Emergenza</ThemedText>
        <Switch
          value={filters.commercial.emergencyExit}
          onValueChange={(value: boolean) =>
            onUpdateFilters({
              category: 'commercial',
              newFilters: { emergencyExit: value },
            })
          }
        />
      </ThemedView>
    </>
  );

  const renderIndustrialFilters = () => (
    <>
      <TouchableOpacity 
        onPress={onBackToCategories}
        className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg"
        style={{ backgroundColor: loginCardBackground }}
      >
        <Ionicons name="swap-horizontal" size={20} color={tintColor} />
        <ThemedText style={{ color: tintColor, marginLeft: 4 }}>
          Cambia Categoria
        </ThemedText>
      </TouchableOpacity>

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Tipo
        </ThemedText>
        <View className="flex-row flex-wrap">
          {INDUSTRIAL_CATEGORIES.map((type) =>
            renderCategoryButton(
              type,
              filters.industrial.category === type,
              () => onUpdateFilters({
                category: 'industrial',
                newFilters: { category: type },
              })
            )
          )}
        </View>
      </ThemedView>

      <ThemedView className="mb-6">
        <ThemedText
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          Specifiche Tecniche
        </ThemedText>
        <QuickNumericSelector
          label="Altezza Soffitti"
          value={filters.industrial.ceilingHeight}
          onValueChange={(value: string) =>
            onUpdateFilters({
              category: 'industrial',
              newFilters: { ceilingHeight: value },
            })
          }
          maxValue={20}
          minValue={2}
          unit="m"
        />
        <QuickNumericSelector
          label="Portata Pavimento"
          value={filters.industrial.floorLoad}
          onValueChange={(value: string) =>
            onUpdateFilters({
              category: 'industrial',
              newFilters: { floorLoad: value },
            })
          }
          maxValue={5000}
          minValue={250}
        />
        <ThemedText 
          className="text-xs mt-1" 
          style={{ color: useThemeColor({}, "tabIconDefault") }}
        >
          Portata in kg/m²
        </ThemedText>
      </ThemedView>

      <QuickNumericSelector
        label="Numero di Uffici"
        value={filters.industrial.offices}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'industrial',
            newFilters: { offices: value },
          })
        }
        maxValue={50}
        minValue={0}
      />

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Struttura Portante
        </ThemedText>
        <View className="flex-row flex-wrap">
          {STRUCTURE_TYPES.map((type) =>
            renderCategoryButton(
              type,
              filters.industrial.structure === type,
              () => onUpdateFilters({
                category: 'industrial',
                newFilters: { structure: type },
              })
            )
          )}
        </View>
      </ThemedView>

      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText style={{ color: textColor }}>Sistema Antincendio</ThemedText>
        <Switch
          value={filters.industrial.fireSystem}
          onValueChange={(value: boolean) =>
            onUpdateFilters({
              category: 'industrial',
              newFilters: { fireSystem: value },
            })
          }
        />
      </ThemedView>
    </>
  );

  const renderLandFilters = () => (
    <>
      <TouchableOpacity 
        onPress={onBackToCategories}
        className="flex-row items-center mb-4 px-3 py-2 self-start rounded-lg"
        style={{ backgroundColor: loginCardBackground }}
      >
        <Ionicons name="swap-horizontal" size={20} color={tintColor} />
        <ThemedText style={{ color: tintColor, marginLeft: 4 }}>
          Cambia Categoria
        </ThemedText>
      </TouchableOpacity>

      <ThemedView className="mb-4">
        <ThemedText className="text-sm mb-2" style={{ color: textColor }}>
          Tipo di Terreno
        </ThemedText>
        <View className="flex-row flex-wrap">
          {LAND_CATEGORIES.map((type) =>
            renderCategoryButton(
              type,
              filters.land.category === type,
              () => onUpdateFilters({
                category: 'land',
                newFilters: { category: type },
              })
            )
          )}
        </View>
      </ThemedView>

      <QuickNumericSelector
        label="Inclinazione Terreno"
        value={filters.land.slope}
        onValueChange={(value: string) =>
          onUpdateFilters({
            category: 'land',
            newFilters: { slope: value },
          })
        }
        maxValue={45}
        minValue={0}
        unit="°"
      />
    </>
  );

  const renderFilters = () => {
    // La prop 'category' è ora keyof Omit<PropertyFilters, "general">
    // quindi non serve toLowerCase() e il controllo è più stretto.
    switch (category) {
      case "residential":
        return renderResidentialFilters();
      case "commercial":
        return renderCommercialFilters();
      case "industrial":
        return renderIndustrialFilters();
      case "land":
        return renderLandFilters();
      default:
        // Questo caso non dovrebbe essere raggiunto se 'category' è sempre valida
        const _exhaustiveCheck: never = category;
        return null;
    }
  };

  return (
    <ThemedView>
      {renderFilters()}
    </ThemedView>
  );
};
