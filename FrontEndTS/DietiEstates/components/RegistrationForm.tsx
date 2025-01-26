import React, { useState } from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LabelInput } from './LabelInput';
import ThemedButton from './ThemedButton';
import { SocialButton } from './SocialButton';
import { Provider } from '@/types/Provider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';


interface RegistrationFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  password: string;
}

export type RegistrationFormProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ lightColor, darkColor, ...props }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    email: '',
    password: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const navigation = useNavigation();

  const background = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const cardBackground = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardBackground');
  const labelColor = useThemeColor({ light: lightColor, dark: darkColor }, 'loginCardLabel');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
  };

  const confirmDate = () => {
    setFormData(prev => ({ ...prev, dateOfBirth: tempDate }));
    setShowDatePicker(false);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <ThemedView className="mt-[10%] mb-[10%] max-w-md p-8 rounded-2xl w-10/12 shadow-lg" style={{ backgroundColor: cardBackground }} {...props}>
      <ThemedText className="py-5 text-center" style={{ fontSize: 36, color: labelColor }}>Benvenuto</ThemedText>
      <ThemedText className="text-lg mb-6 text-center" style={{ color: labelColor }}>Registrati</ThemedText>
      <LabelInput
        type="default"
        label="Nome"
        placeholder="Nome"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.firstName}
        onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
        className="mb-6"
      />
      <LabelInput
        type="default"
        label="Cognome"
        placeholder="Cognome"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.lastName}
        onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
        className="mb-6"
      />
      <View className="mb-6">
        <ThemedText className="mb-2" style={{ color: labelColor }}>Data di nascita</ThemedText>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border p-2 rounded-md min-h-[40px] min-w-[200px] w-full" style={{ backgroundColor: background }}>
          <ThemedText style={{ color: text }}>{formData.dateOfBirth.toLocaleDateString()}</ThemedText>
        </TouchableOpacity>
        {showDatePicker && (
          <View className='flex-1 justify-center items-center'>
            {/* //BUG DOES NOT WORK ON WEB! */}
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
            <ThemedButton
              title="Conferma"
              onPress={confirmDate}
              borderRadius={8}
              className="w-full min-h-[40px] mt-4"
            />
          </View>
        )}
      </View>
      <LabelInput
        type="email"
        label="Email"
        placeholder="Email"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.email}
        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        className="mb-6"
        autoCapitalize="none"
      />
      <LabelInput
        type="password"
        label="Password"
        placeholder="Password"
        textColor={text}
        lightColor={cardBackground}
        darkColor={cardBackground}
        inputBackgroundColor={background}
        value={formData.password}
        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
        className="mb-6"
      />
      <ThemedButton
        title="Registrati"
        onPress={handleSubmit}
        borderRadius={8}
        className="min-h-[40px]"
      />
      <ThemedText className="text-base mt-3 mb-3 text-center" style={{ color: labelColor }}>or continue with:</ThemedText>
      <View className="items-center mb-3">
        <SocialButton provider={Provider.Google} onPress={() => console.log('Login con Google')} lightColor='#FFFFFF' darkColor='#FFFFFF' />
      </View>
      <View className="items-center mb-3">
        <SocialButton provider={Provider.Meta} onPress={() => console.log('Login con Meta')} lightColor='#FFFFFF' darkColor='#1877F2' />
      </View>
      <View className="items-center mb-3">
        <SocialButton provider={Provider.GitHub} onPress={() => console.log('Login con GitHub')} lightColor='#FFFFFF' darkColor='#333333' />
      </View>
        <View className="flex-row justify-center mt-3">
          <ThemedText style={{ color: labelColor }}>Have an account already? </ThemedText>
              {/* //TODO fix this! */}
            <TouchableOpacity onPress={() => navigation.navigate('(buyer)/login' as never)}> 
              <ThemedText className="text-blue-500 underline font-bold" style={{ color: labelColor }}>
                Sign in
              </ThemedText>
            </TouchableOpacity>
        </View>
    </ThemedView>
  );
};

export default RegistrationForm;