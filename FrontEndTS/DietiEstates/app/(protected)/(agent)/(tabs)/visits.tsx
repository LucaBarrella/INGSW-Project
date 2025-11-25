import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { VisitRequestCard } from "@/components/Agent/VisitManagement/VisitRequestCard";
import { VisitRequest } from "@/components/Agent/VisitManagement/types";
import { useTranslation } from "react-i18next";
import { useVisits } from "@/src/hooks/useVisits";

export default function Visits() {
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getVisitsOfCurrentAgent } = useVisits();
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visits = await getVisitsOfCurrentAgent();
        if (visits) {
          const formattedRequests = visits.map((visit, index) => ({
            id: index + 1,
            address: visit.address.city+", "+visit.address.street+" "+visit.address.streetNumber,
            date: new Date(visit.visit.startTime * 1000).toLocaleString(),
            status: visit.visit.status
          }));
          setVisitRequests(formattedRequests);
        }
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []); // Empty dependency array = run once on mount

  
  const handleVisitRequest = (
    requestId: number,
    status: "ACCEPTED" | "REJECTED" | "DELETED" | "PENDING"
  ) => {
    if (status === "DELETED") {
      setVisitRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } else {
      setVisitRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status } : request
        )
      );
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <SafeAreaView>
        <ScrollView className="p-5 flex-grow">
          <ThemedView className="mb-5">
            <ThemedText type="title" className="text-2xl mb-4 leading-none">
              {t('visit_requests')}
            </ThemedText>
            
            {loading && (<ThemedText>{t('loading')}</ThemedText>)}

            <ThemedView className="flex flex-col gap-4">
              {visitRequests.map((request) => (
                <VisitRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleVisitRequest(request.id, "ACCEPTED")}
                  onReject={() => handleVisitRequest(request.id, "REJECTED")}
                  onDelete={() => handleVisitRequest(request.id, "DELETED")}
                />
              ))}
              <SafeAreaView className="mb-16" />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
