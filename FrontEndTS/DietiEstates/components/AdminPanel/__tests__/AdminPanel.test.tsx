import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AdminPanel } from "../../../app/(home)/(admin)/AdminPanel";

describe("AdminPanel", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AdminPanel />);
    expect(getByText("Pannello Amministratore")).toBeTruthy();
  });

  it("switches between different forms", () => {
    const { getByText, queryByText } = render(<AdminPanel />);

    fireEvent.press(getByText("Cambia Password"));
    expect(queryByText("Password Attuale")).toBeTruthy();

    fireEvent.press(getByText("Nuovo Amministratore"));
    expect(queryByText("Nuovo Amministratore")).toBeTruthy();

    fireEvent.press(getByText("Nuovo agente immobiliare"));
    expect(queryByText("Nuovo Agente Immobiliare")).toBeTruthy();
  });
});
