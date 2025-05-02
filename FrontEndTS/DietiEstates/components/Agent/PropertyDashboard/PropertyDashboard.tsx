import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "./StatCard";
import { PropertyTable } from "./PropertyTable";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { IconButtonCard } from "@/components/IconButtonCard";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DashboardStats, PropertyDetail, DateRange } from "./types"; // Assumiamo che questi tipi siano corretti o li adatteremo
import ApiService from "@/app/_services/api.service"; // Importa ApiService

const PropertyDashboard: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'propertyCardBackground');
  const textColor = useThemeColor({}, 'text');
  // TODO: Definire un colore 'error' nel tema o usare uno stile specifico
  const errorColor = useThemeColor({}, 'tint'); // Usiamo 'tint' come placeholder

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const range = {
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), // 1 month ago
      endDate: today,
    };
    console.log('Initial date range set:', range);
    return range;
  });

  // Stato per i dettagli delle proprietà (inizializzato vuoto)
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetail[]>([]);

  // Stato per le statistiche (inizializzato con valori default o vuoti)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    activeListings: 0,
    averagePrice: 0,
    monthlyViews: 0,
    totalBookings: 0,
    averageBookingsPerProperty: 0,
  });

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    console.log('Dashboard: Date range changed to:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    setDateRange({ startDate, endDate });
  };

  // Funzione per recuperare le statistiche
  const fetchAgentStats = useCallback(async (currentDateRange: DateRange) => {
    setIsLoadingStats(true);
    setError(null);
    try {
      const params = {
        startDate: currentDateRange.startDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        endDate: currentDateRange.endDate.toISOString().split('T')[0],     // Formato YYYY-MM-DD
      };
      console.log('Fetching stats with params:', params);
      // TODO: Assicurarsi che l'API getAgentStats accetti startDate e endDate
      // Se non li accetta, rimuovere i params dalla chiamata
      const statsData = await ApiService.getAgentStats(/* params */);
      // TODO: Adattare statsData alla struttura attesa da DashboardStats
      // TODO: Adattare statsData alla struttura attesa da DashboardStats
      console.log("Stats data received:", statsData); // Log dati ricevuti
      setDashboardStats(statsData || { /* valori di default in caso di null */ });
    } catch (err) {
      console.error("!!! CATCH Error fetching agent stats:", err); // Log errore più evidente
      setError(t('errors.fetchStatsError')); // Messaggio di errore generico
      // Resetta le stats con valori di default corretti
      setDashboardStats({
        totalProperties: 0,
        soldProperties: 0,
        rentedProperties: 0,
        activeListings: 0,
        averagePrice: 0,
        monthlyViews: 0,
        totalBookings: 0,
        averageBookingsPerProperty: 0,
      });
    } finally {
      console.log("FINALLY fetchAgentStats - setting isLoadingStats to false"); // Log finally
      setIsLoadingStats(false);
    }
  }, [t]); // Aggiunto t come dipendenza

  // Funzione per recuperare le proprietà
  const fetchAgentProperties = useCallback(async (currentDateRange: DateRange) => {
    setIsLoadingProperties(true);
    setError(null); // Resetta l'errore anche qui
    try {
      const params = {
        startDate: currentDateRange.startDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        endDate: currentDateRange.endDate.toISOString().split('T')[0],     // Formato YYYY-MM-DD
        // Aggiungere qui altri parametri se necessari (es. sort, pagination)
      };
      console.log('Fetching properties with params:', params);
      const propertiesData = await ApiService.getAgentProperties(params);
      // TODO: Adattare propertiesData alla struttura attesa da PropertyDetail[]
      // TODO: Adattare propertiesData alla struttura attesa da PropertyDetail[]
      console.log("Properties data received:", propertiesData); // Log dati ricevuti
      setPropertyDetails(propertiesData || []);
    } catch (err) {
      console.error("!!! CATCH Error fetching agent properties:", err); // Log errore più evidente
      setError(t('errors.fetchPropertiesError')); // Messaggio di errore generico
      setPropertyDetails([]); // Resetta le proprietà in caso di errore
    } finally {
      console.log("FINALLY fetchAgentProperties - setting isLoadingProperties to false"); // Log finally
      setIsLoadingProperties(false);
    }
  }, [t]); // Aggiunto t come dipendenza

  // useEffect per caricare i dati al mount e al cambio di dateRange
  useEffect(() => {
    // Rimosso log di debug
    console.log('Date range changed, fetching data...');
    fetchAgentStats(dateRange);
    fetchAgentProperties(dateRange);
  }, [dateRange]); // Rimosse fetchAgentStats e fetchAgentProperties dalle dipendenze

  const exportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  return (
    <>
      <ThemedView 
        className="flex-1" 
        style={{ backgroundColor }}
      >
        {isLoadingStats || isLoadingProperties ? (
          <ThemedView className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <ThemedText className="mt-2">{t('loading')}</ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView className="flex-1 items-center justify-center p-4">
            <ThemedText style={{ color: errorColor }} className="text-center">
              {error}
            </ThemedText>
            {/* TODO: Aggiungere un pulsante per riprovare? */}
          </ThemedView>
        ) : ( // Parentesi tonda di apertura
          <PropertyTable
            propertyDetails={propertyDetails} // Usa i dati dall'API
            ListHeaderComponent={(
              <ThemedView className="p-6">
                {/* Stat Cards */}
                <ThemedView className="flex flex-row flex-wrap mb-6">
                  <ThemedView className="w-1/2 p-1">
                    <StatCard
                      title={t("totalProperties")}
                      value={dashboardStats.totalProperties}
                    />
                  </ThemedView>
                  <ThemedView className="w-1/2 p-1">
                    <StatCard
                      title={t("propertiesSold")}
                      value={dashboardStats.soldProperties}
                    />
                  </ThemedView>
                  <ThemedView className="w-1/2 p-1">
                    <StatCard
                      title={t("monthlyViews")} // TODO: Verificare se il nome della stat è corretto
                      value={dashboardStats.monthlyViews}
                    />
                  </ThemedView>
                  <ThemedView className="w-1/2 p-1">
                    <StatCard
                      title={t("scheduledVisits")} // TODO: Verificare se il nome della stat è corretto
                      value={dashboardStats.totalBookings}
                    />
                  </ThemedView>
                  {/* TODO: Aggiungere altre StatCard se necessario (es. rented, active, avgPrice) */}
                </ThemedView>
                
                {/* Controlli (Date Range e Export) */}
                <ThemedView
                  className="rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                style={{ backgroundColor: cardBackground }}
              >
                <ThemedView className="flex flex-col gap-4">
                  <ThemedView className="flex flex-col items-center gap-4"  style={{ backgroundColor: cardBackground }}>
                    <ThemedText 
                      className="text-xl font-semibold"
                      style={{ color: textColor }}
                    >
                      {t("propertyOverview")}
                    </ThemedText>
                    <ThemedView  style={{ backgroundColor: cardBackground }} className="flex flex-col gap-3 items-center min-w-[320px] items-center justify-center">
                      <TimeRangeSelector  
                        defaultStartDate={dateRange.startDate}
                        defaultEndDate={dateRange.endDate}
                        onDateChange={handleDateRangeChange}
                      />
                      {/* Rimosso Export PDF Button - Inizio */}
                      {/* <ThemedView style={{ backgroundColor: cardBackground, transform: [{ scale: 0.8 }] }}>
                        <IconButtonCard
                          title={t("exportTable")}
                          onSelect={exportToPDF}
                          accessibilityLabel={t("exportTable")}
                          iconUrl="material-symbols:sim-card-download-outline"
                          className="min-w-[240px]"
                          textDimensions={16}
                          iconSize={20}
                        />
                      </ThemedView> */}
                      {/* Rimosso Export PDF Button - Fine */}
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          )} 
        />
        ) // Parentesi tonda di chiusura
       }
      </ThemedView>
      <SafeAreaView />
    </> 
  );
};

export default PropertyDashboard;
