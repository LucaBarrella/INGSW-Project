import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../../../../types/agenda';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ConflictBlockProps {
  appointments: Appointment[];
}

const ConflictBlock: React.FC<ConflictBlockProps> = ({ appointments }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const conflictColor = useThemeColor({}, 'errorIcon');
  const conflictBgColor = useThemeColor({}, 'errorBackground');
  const conflictBorderColor = useThemeColor({}, 'errorIcon');
  const conflictTextColor = useThemeColor({}, 'errorText');
  const time = `${appointments[0].startTime.getHours()}:${String(appointments[0].startTime.getMinutes()).padStart(2, '0')} - ${appointments[0].endTime.getHours()}:${String(appointments[0].endTime.getMinutes()).padStart(2, '0')}`;

  return (
    <View style={{ backgroundColor: conflictBgColor, borderColor: conflictBorderColor }} className="shadow-md rounded-lg p-3 border-l-4">
      <Text style={{ color: conflictTextColor }} className="font-bold text-base">CONFLICT</Text>
      <Text style={{ color: conflictTextColor }} className="text-xs mb-2">{time}</Text>
      
      {appointments.map((app, index) => (
        <View key={app.id} className={`py-2 ${index < appointments.length - 1 ? 'border-b' : ''}`} style={{ borderColor: conflictBorderColor }}>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color={conflictColor} />
            <Text style={{ color: conflictTextColor }} className="ml-1.5 text-sm flex-shrink">{app.property.address}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="person-outline" size={14} color={conflictColor} />
            <Text style={{ color: conflictTextColor }} className="ml-1.5 text-sm font-semibold">{app.client.name}</Text>
          </View>
        </View>
      ))}

      <View className="mt-3 pt-3 border-t" style={{ borderColor: conflictBorderColor + '99' }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center justify-center">
          <Ionicons name="warning-outline" size={18} color={conflictColor} />
          <Text style={{ color: conflictTextColor }} className="font-bold ml-2 text-sm">Resolve Conflict</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-lg font-bold mb-4">Resolve Conflict</Text>
            <Text className="mb-4">Choose which appointment to cancel:</Text>
            {appointments.map(app => (
              <TouchableOpacity key={app.id} className="p-3 rounded-lg mb-2" style={{ backgroundColor: conflictBgColor }}>
                <Text style={{ color: conflictTextColor }}>{app.property.address} with {app.client.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-4 p-3 rounded-lg" style={{ backgroundColor: conflictBorderColor }}>
              <Text className="text-center font-bold" style={{ color: conflictBgColor }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConflictBlock;
