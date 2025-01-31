import React, { useState } from "react";
import { ScrollView } from "react-native";
import { ActionButton } from "@/components/AdminPanel/ActionButton";
import { InputField } from "@/components/AdminPanel/InputField";
import { Form } from "@/components/AdminPanel/Form";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export const AdminPanel: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    adminFirstName: "",
    adminLastName: "",
    adminBirthDate: "",
    adminEmail: "",
    adminPassword: "",
    agentFirstName: "",
    agentLastName: "",
    agentBirthDate: "",
    agentEmail: "",
    agentPhone: "",
    agentPassword: "",
  });

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission based on selectedAction
  };

  return (
    <ThemedView className="flex relative flex-col pb-20 mx-auto w-full max-w-[480px]">
      <ThemedView className="p-6 mb-8 bg-sky-800">
        <ThemedText className="text-2xl font-semibold text-[white]">
          Pannello Amministratore
        </ThemedText>
      </ThemedView>

      <ScrollView>
        <ThemedView className="flex flex-col gap-6 p-6 mx-auto my-0 max-w-[600px]">
          <ThemedText className="mb-4 text-base text-center text-sky-800">
            Scegli l'operazione da fare:
          </ThemedText>

          <ThemedView className="flex gap-4 justify-center">
            <ActionButton
              label="Cambia Password"
              isSelected={selectedAction === "password"}
              onPress={() => setSelectedAction("password")}
            />
            <ActionButton
              label="Nuovo Amministratore"
              isSelected={selectedAction === "admin"}
              onPress={() => setSelectedAction("admin")}
            />
            <ActionButton
              label="Nuovo agente immobiliare"
              isSelected={selectedAction === "agent"}
              onPress={() => setSelectedAction("agent")}
            />
          </ThemedView>

          {selectedAction === "password" && (
            <Form title="Cambia Password" onSubmit={handleSubmit}>
              <InputField
                label="Password Attuale"
                id="current-password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange("currentPassword")}
                placeholder="Password Attuale"
              />
              <InputField
                label="Nuova Password"
                id="new-password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Nuova Password"
              />
              <InputField
                label="Conferma Password"
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                placeholder="Conferma Password"
              />
            </Form>
          )}

          {selectedAction === "admin" && (
            <Form title="Nuovo Amministratore" onSubmit={handleSubmit}>
              <InputField
                label="Nome"
                id="admin-first-name"
                type="text"
                value={formData.adminFirstName}
                onChange={handleInputChange("adminFirstName")}
                placeholder="Nome"
              />
              <InputField
                label="Cognome"
                id="admin-last-name"
                type="text"
                value={formData.adminLastName}
                onChange={handleInputChange("adminLastName")}
                placeholder="Cognome"
              />
              <InputField
                label="Data di nascita"
                id="admin-birth-date"
                type="date"
                value={formData.adminBirthDate}
                onChange={handleInputChange("adminBirthDate")}
                placeholder="Data di nascita"
              />
              <InputField
                label="Email"
                id="admin-email"
                type="email"
                value={formData.adminEmail}
                onChange={handleInputChange("adminEmail")}
                placeholder="Email"
              />
              <InputField
                label="Password"
                id="admin-password"
                type="password"
                value={formData.adminPassword}
                onChange={handleInputChange("adminPassword")}
                placeholder="Password"
              />
            </Form>
          )}

          {selectedAction === "agent" && (
            <Form title="Nuovo Agente Immobiliare" onSubmit={handleSubmit}>
              <InputField
                label="Nome"
                id="agent-first-name"
                type="text"
                value={formData.agentFirstName}
                onChange={handleInputChange("agentFirstName")}
                placeholder="Nome"
              />
              <InputField
                label="Cognome"
                id="agent-last-name"
                type="text"
                value={formData.agentLastName}
                onChange={handleInputChange("agentLastName")}
                placeholder="Cognome"
              />
              <InputField
                label="Data di nascita"
                id="agent-birth-date"
                type="date"
                value={formData.agentBirthDate}
                onChange={handleInputChange("agentBirthDate")}
                placeholder="Data di nascita"
              />
              <InputField
                label="Email"
                id="agent-email"
                type="email"
                value={formData.agentEmail}
                onChange={handleInputChange("agentEmail")}
                placeholder="Email"
              />
              <InputField
                label="Numero di telefono"
                id="agent-phone"
                type="tel"
                value={formData.agentPhone}
                onChange={handleInputChange("agentPhone")}
                placeholder="Numero di telefono"
              />
              <InputField
                label="Password"
                id="agent-password"
                type="password"
                value={formData.agentPassword}
                onChange={handleInputChange("agentPassword")}
                placeholder="Password"
              />
            </Form>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};
