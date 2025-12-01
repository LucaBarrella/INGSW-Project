import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VisitRequest } from '../../../../src/dto/agenda';
import { useThemeColor } from '@/hooks/useThemeColor';
import { t } from 'i18next';
import { useVisits } from '@/src/hooks/useVisits';

interface GroupVisitCardProps {
  appointments: VisitRequest[];
}

const GroupVisitCard: React.FC<GroupVisitCardProps> = ({ appointments }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedVisits, setSelectedVisits] = useState<Set<number>>(new Set());
  
  const { updateVisitStatus } = useVisits();

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const toggleVisitSelection = (visitId: number) => {
    const newSelected = new Set(selectedVisits);
    if (newSelected.has(visitId)) {
      newSelected.delete(visitId);
    } else {
      newSelected.add(visitId);
    }
    setSelectedVisits(newSelected);
  };

  const handleConfirmCancel = () => {
    // Call updateVisitStatus for each selected visit
    selectedVisits.forEach(visitId => {
      updateVisitStatus(visitId, 'CANCELLED'); // Adjust status value as needed
    });
    
    // Reset state
    setSelectedVisits(new Set());
    setShowCancelModal(false);
    setIsExpanded(false);
  };

  const handleCloseModal = () => {
    setSelectedVisits(new Set());
    setShowCancelModal(false);
  };

  // Extract common information from first appointment
  const firstAppointment = appointments[0];
  const { startTime, endTime, property } = firstAppointment;
  
  // Collect all clients from all appointments in the group
  const clients = appointments.map(app => app.userInfo);
  
  const time = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')} - ${endTime.getHours()}:${String(endTime.getMinutes()).padStart(2, '0')}`;

  const cardBackgroundColor = useThemeColor({}, 'tabBarBackground');
  const cardBorderColor = useThemeColor({}, 'tabBarBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'tabIconDefault');
  const conflictColor = useThemeColor({}, 'error');
  const primaryColor = useThemeColor({}, 'tint');

  return (
    <>
      <View className="shadow-md rounded-lg p-3 border" style={{ backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }}>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <View className="flex-row justify-between items-center">
            <Text style={{ color: textColor }} className="text-base font-bold">Visita di Gruppo</Text>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={16} color={secondaryTextColor} />
              <Text style={{ color: secondaryTextColor }} className="text-sm font-bold ml-1">{clients.length}</Text>
            </View>
          </View>
          <Text style={{ color: secondaryTextColor }} className="text-xs mb-2">{time}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color={secondaryTextColor} />
            <Text style={{ color: secondaryTextColor }} className="ml-1.5 text-sm flex-shrink">{property.address}</Text>
          </View>
          <View className="flex-row items-start mt-1">
            <Ionicons name="people-outline" size={14} color={secondaryTextColor} />
            <Text style={{ color: secondaryTextColor }} className="ml-1.5 text-sm font-semibold flex-1">
              {clients.map(c => c.fullName).join(', ')}
            </Text>
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View className="mt-3 pt-3 border-t" style={{ borderColor: cardBorderColor + '99' }}>
            <TouchableOpacity className="flex-row items-center justify-center" onPress={handleCancelClick}>
              <Ionicons name="trash-outline" size={18} color={conflictColor} />
              <Text style={{ color: conflictColor }} className="font-bold ml-2 text-sm">{t('cancelVisit')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Cancel Selection Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="rounded-lg p-5 w-11/12 max-w-md" style={{ backgroundColor: cardBackgroundColor }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text style={{ color: textColor }} className="text-lg font-bold">{t('selectVisitsToCancel')}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={secondaryTextColor} />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96 mb-4">
              {appointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  onPress={() => toggleVisitSelection(appointment.id)}
                  className="flex-row items-center p-3 mb-2 rounded-lg border"
                  style={{ 
                    backgroundColor: selectedVisits.has(appointment.id) ? primaryColor + '20' : cardBackgroundColor,
                    borderColor: selectedVisits.has(appointment.id) ? primaryColor : cardBorderColor
                  }}
                >
                  <View className="flex-1">
                    <Text style={{ color: textColor }} className="font-semibold text-base">
                      {appointment.userInfo.fullName}
                    </Text>
                    <Text style={{ color: secondaryTextColor }} className="text-sm mt-1">
                      {time}
                    </Text>
                  </View>
                  <View className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{ 
                      borderColor: selectedVisits.has(appointment.id) ? primaryColor : secondaryTextColor,
                      backgroundColor: selectedVisits.has(appointment.id) ? primaryColor : 'transparent'
                    }}
                  >
                    {selectedVisits.has(appointment.id) && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={handleCloseModal}
                className="px-4 py-2 rounded-lg mr-2"
                style={{ backgroundColor: cardBorderColor }}
              >
                <Text style={{ color: secondaryTextColor }} className="font-semibold">{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                disabled={selectedVisits.size === 0}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: selectedVisits.size === 0 ? cardBorderColor : conflictColor,
                  opacity: selectedVisits.size === 0 ? 0.5 : 1
                }}
              >
                <Text className="text-white font-semibold">
                  {t('delete')} ({selectedVisits.size})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GroupVisitCard;