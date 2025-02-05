import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from './ThemedText';
import ThemedButton from './ThemedButton';
import { ThemedView } from './ThemedView';

interface ConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  messageKey: 'changePassword' | 'createAdmin' | 'createAgent';
}

export function ConfirmationDialog({ visible, onConfirm, onCancel, messageKey }: ConfirmationDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>{t('forms.confirmation.title')}</ThemedText>
          <ThemedText style={styles.modalText}>
            {t(`forms.confirmation.messages.${messageKey}`)}
          </ThemedText>
          <View style={styles.buttonsContainer}>
            <ThemedButton
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
              className="py-2"
              fontSize={16}
              lightColor="#6c757d"
              darkColor="#6c757d"
              title={t('forms.confirmation.buttons.cancel')}
            />
            <ThemedButton
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              className="py-2"
              fontSize={16}
              lightColor="#007bff"
              darkColor="#007bff"
              title={t('forms.confirmation.buttons.confirm')}
            />
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
