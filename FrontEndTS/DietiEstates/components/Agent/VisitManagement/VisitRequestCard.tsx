import { ThemedText } from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { VisitRequest } from "./types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

interface VisitRequestCardProps {
  request: VisitRequest;
  onAccept: () => void;
  onReject: () => void;
  onDelete?: () => void;
}

export const VisitRequestCard: React.FC<VisitRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  onDelete,
}) => {
  const [deleteCountdown, setDeleteCountdown] = useState<number | null>(null);
  
  // Pre-compute all theme colors
  const statusColors = {
    pending: useThemeColor({}, 'visitStatusPending'),
    accepted: useThemeColor({}, 'visitStatusAccepted'),
    rejected: useThemeColor({}, 'visitStatusRejected'),
    deleted: useThemeColor({}, 'visitStatusDeleted')
  };

  const getStatusColor = (status: VisitRequest["status"]) => {
    return statusColors[status];
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deleteCountdown !== null && deleteCountdown > 0) {
      timer = setInterval(() => {
        setDeleteCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (deleteCountdown === 0) {
      // resetto il countdown e chiamo onDelete fuori dal ciclo di rendering
      setDeleteCountdown(null);
      setTimeout(() => {
        if (onDelete) {
          onDelete();
        }
      }, 0);
    }
    return () => clearInterval(timer);
  }, [deleteCountdown, onDelete]);

  const handleDeletePressIn = () => {
    setDeleteCountdown(2);
  };

  const handleDeletePressOut = () => {
    setDeleteCountdown(null);
  };

  return (
    <View style={{ width: "100%" }}>
      <ThemedView className="flex flex-col gap-4 justify-between items-center p-4 rounded-lg bg-white shadow-md">
        <ThemedView className="w-full">
          <ThemedText className="text-lg font-semibold mb-2">
            {request.clientName}
          </ThemedText>
          <ThemedText className="text-gray-600 mb-1">
            Requested date: {request.date}
          </ThemedText>
          <ThemedText
            style={{ fontWeight: "bold", color: getStatusColor(request.status) }}
          >
            Status: {request.status}
          </ThemedText>
        </ThemedView>
        
        {request.status === "pending" && (
          <ThemedView className="flex-row justify-between items-center w-full mt-2">
            <ThemedButton
              onPress={onAccept}
              title="Accept"
              style={{ backgroundColor: statusColors.accepted }}
              borderRadius={10}
              className="px-8 py-4 rounded mr-auto"
              accessibilityLabel={`Accept visit request from ${request.clientName}`}
            />
            <ThemedButton
              onPress={onReject}
              title="Reject"
              style={{ backgroundColor: statusColors.rejected }}
              borderRadius={10}
              className="px-8 py-4 ml-auto"
              accessibilityLabel={`Reject visit request from ${request.clientName}`}
            />
          </ThemedView>
        )}
        
        {request.status !== "pending" && onDelete && (
          <ThemedView className="w-full mt-2">
            <TouchableOpacity
              onPressIn={handleDeletePressIn}
              onPressOut={handleDeletePressOut}
              style={{
                backgroundColor: statusColors.deleted,
                borderRadius: 10,
                paddingHorizontal: 32,
                paddingVertical: 16,
                alignItems: "center",
              }}
              accessibilityLabel={`Delete visit request from ${request.clientName}`}
            >
              <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                {deleteCountdown !== null ? `Deleting in ${deleteCountdown}s` : "Delete"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </View>
  );
};
