import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "./StatCard";
import { PropertyTable } from "./PropertyTable";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { IconButtonCard } from "@/components/IconButtonCard";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DashboardStats, PropertyDetail, DateRange } from "./types";

const PropertyDashboard: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'propertyCardBackground');
  const textColor = useThemeColor({}, 'text');
  
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    const range = {
      startDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), // 1 month ago
      endDate: today,
    };
    console.log('Initial date range set:', range);
    return range;
  });
  
  const [propertyDetails] = useState<PropertyDetail[]>([
    {
      id: 1,
      title: "Luxury Villa with Pool",
      address: "123 Ocean Drive, Miami Beach",
      type: "Villa",
      price: "1,250,000",
      views: 856,
      bookings: 12,
      status: "available",
      createdAt: new Date(2024, 0, 15).toISOString(), // 15 Gennaio 2024
      updatedAt: new Date(2024, 1, 1).toISOString(),
    },
    {
      id: 2,
      title: "Modern Downtown Apartment",
      address: "456 City Center, New York",
      type: "Apartment",
      price: "750,000",
      views: 643,
      bookings: 8,
      status: "sold",
      createdAt: new Date(2024, 1, 1).toISOString(), // 1 Febbraio 2024
      updatedAt: new Date(2024, 1, 10).toISOString(),
    },
    {
      id: 3,
      title: "Cozy Studio Near University",
      address: "789 College Ave, Boston",
      type: "Studio",
      price: "320,000",
      views: 421,
      bookings: 5,
      status: "rented",
      createdAt: new Date(2024, 1, 5).toISOString(), // 5 Febbraio 2024
      updatedAt: new Date(2024, 1, 15).toISOString(),
    },
  ]);

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

  const filteredProperties = useMemo(() => {
    console.log('Filtering properties for date range:', {
      start: dateRange.startDate.toISOString(),
      end: dateRange.endDate.toISOString()
    });

    return propertyDetails.filter(property => {
      const propertyDate = new Date(property.createdAt);
      propertyDate.setHours(0, 0, 0, 0);
      const start = new Date(dateRange.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      const isInRange = propertyDate >= start && propertyDate <= end;
      console.log('Property date check:', {
        id: property.id,
        propertyDate: propertyDate.toISOString(),
        isInRange
      });
      return isInRange;
    });
  }, [propertyDetails, dateRange]);

  useEffect(() => {
    console.log('Calculating stats for filtered properties:', filteredProperties.length);
    
    const newStats: DashboardStats = {
      totalProperties: filteredProperties.length,
      soldProperties: filteredProperties.filter((p) => p.status === "sold").length,
      rentedProperties: filteredProperties.filter((p) => p.status === "rented").length,
      activeListings: filteredProperties.filter((p) => p.status === "available").length,
      averagePrice: 0,
      monthlyViews: filteredProperties.reduce((sum, property) => sum + property.views, 0),
      totalBookings: filteredProperties.reduce((sum, property) => sum + property.bookings, 0),
      averageBookingsPerProperty: 0,
    };

    if (filteredProperties.length > 0) {
      const totalPrice = filteredProperties.reduce(
        (sum, property) => sum + parseInt(property.price.replace(/,/g, "")),
        0
      );
      newStats.averagePrice = Math.round(totalPrice / filteredProperties.length);
      newStats.averageBookingsPerProperty = Number(
        (newStats.totalBookings / filteredProperties.length).toFixed(1)
      );
    }

    console.log('Setting new dashboard stats:', newStats);
    setDashboardStats(newStats);
  }, [filteredProperties]);

  const exportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  return (
    <>
      <ThemedView 
        className="flex-1" 
        style={{ backgroundColor }}
      >
        <PropertyTable
          propertyDetails={filteredProperties}
          ListHeaderComponent={(
            <ThemedView className="p-6">
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
                    title={t("monthlyViews")}
                    value={dashboardStats.monthlyViews} 
                  />
                </ThemedView>
                <ThemedView className="w-1/2 p-1">
                  <StatCard
                    title={t("scheduledVisits")}
                    value={dashboardStats.totalBookings} 
                  />
                </ThemedView>
              </ThemedView>
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
                      <ThemedView style={{ backgroundColor: cardBackground, transform: [{ scale: 0.8 }] }}>
                        <IconButtonCard
                          title={t("exportTable")}
                          onSelect={exportToPDF}
                          accessibilityLabel={t("exportTable")}
                          iconUrl="material-symbols:sim-card-download-outline"
                          className="min-w-[240px]"
                          textDimensions={16}
                          iconSize={20}
                        />
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          )} 
        />
      </ThemedView>
      <SafeAreaView />
    </> 
  );
};

export default PropertyDashboard;
