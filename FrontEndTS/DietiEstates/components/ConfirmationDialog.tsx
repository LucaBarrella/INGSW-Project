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
  messageKey?: 'changePassword' | 'createAdmin' | 'createAgent'; // Made optional
  customMessage?: string; // Added custom message prop
  customTitle?: string; // Added custom title prop
  confirmText?: string; // Added custom confirm button text
  showCancelButton?: boolean; // Added prop to hide cancel button
}

export function ConfirmationDialog({
  visible,
  onConfirm,
  onCancel,
  messageKey,
  customMessage,
  customTitle,
  confirmText,
  showCancelButton = true // Default to true
}: ConfirmationDialogProps) {
  const { t } = useTranslation();

  const title = customTitle ?? t('forms.confirmation.title');
  const message = customMessage ?? (messageKey ? t(`forms.confirmation.messages.${messageKey}`) : '');
  const confirmButtonText = confirmText ?? t('forms.confirmation.buttons.confirm');
  const cancelButtonText = t('forms.confirmation.buttons.cancel');

  // Ensure either messageKey or customMessage is provided
  if (!messageKey && !customMessage) {
    console.warn("ConfirmationDialog requires either 'messageKey' or 'customMessage'.");
    return null; // Or render an error state
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalText}>
            {message}
          </ThemedText>
          <View style={styles.buttonsContainer}>
            {showCancelButton && (
              <ThemedButton
                onPress={onCancel}
                style={[styles.button, styles.cancelButton]}
                className="py-2"
                fontSize={16}
                lightColor="#6c757d"
                darkColor="#6c757d"
                title={cancelButtonText}
              />
            )}
            <ThemedButton
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton, !showCancelButton && styles.fullWidthButton]} // Adjust style if only one button
              className="py-2"
              fontSize={16}
              lightColor="#007bff"
              darkColor="#007bff"
              title={confirmButtonText}
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
  fullWidthButton: { // Style for confirm button when cancel is hidden
    flex: 0, // Reset flex
    width: '80%', // Make it wider but not full width
  }
});
