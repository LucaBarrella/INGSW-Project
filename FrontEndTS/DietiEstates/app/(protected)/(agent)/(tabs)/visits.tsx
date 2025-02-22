import React, { useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { VisitRequestCard } from "@/components/Agent/VisitManagement/VisitRequestCard";
import { VisitRequest } from "@/components/Agent/VisitManagement/types";

const initialVisitRequests: VisitRequest[] = [
  {
    id: 1,
    clientName: "Marco Rossi",
    date: "2024-01-15 10:00",
    status: "pending",
    propertyId: "prop123",
  },
  {
    id: 2,
    clientName: "Giulia Bianchi",
    date: "2024-01-16 15:30",
    status: "pending",
    propertyId: "prop456",
  },
  {
    id: 3,
    clientName: "Alessandro Verdi",
    date: "2024-01-17 11:00",
    status: "pending",
    propertyId: "prop789",
  },
  {
    id: 4,
    clientName: "Sofia Romano",
    date: "2024-01-18 14:00",
    status: "pending",
    propertyId: "prop321",
  },
  {
    id: 5,
    clientName: "Luca Ferrari",
    date: "2024-01-19 16:45",
    status: "pending",
    propertyId: "prop654",
  },
];

export default function Visits() {
  const [visitRequests, setVisitRequests] =
    useState<VisitRequest[]>(initialVisitRequests);

  const handleVisitRequest = (
    requestId: number,
    status: "accepted" | "rejected" | "delete"
  ) => {
    if (status === "delete") {
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
                Richieste di visita
              </ThemedText>
              <ThemedView className="flex flex-col gap-4">
                {visitRequests.map((request) => (
                  <VisitRequestCard
                    key={request.id}
                    request={request}
                    onAccept={() => handleVisitRequest(request.id, "accepted")}
                    onReject={() => handleVisitRequest(request.id, "rejected")}
                    onDelete={() => handleVisitRequest(request.id, "delete")}
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
