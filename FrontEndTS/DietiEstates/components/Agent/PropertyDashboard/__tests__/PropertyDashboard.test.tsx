import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PropertyDashboard from "../PropertyDashboard";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("PropertyDashboard", () => {
  it("renders correctly", () => {
    const { getByText } = render(<PropertyDashboard />);
    expect(getByText("propertyOverview")).toBeTruthy();
  });

  it("displays correct number of stat cards", () => {
    const { getAllByTestId } = render(<PropertyDashboard />);
    const statCards = getAllByTestId("stat-card");
    expect(statCards.length).toBe(4);
  });

  it("allows changing time range", () => {
    const { getByTestId } = render(<PropertyDashboard />);
    const picker = getByTestId("time-range-selector");
    fireEvent(picker, "onValueChange", "last-3-months");
    expect(picker.props.selectedValue).toBe("last-3-months");
  });

  it("exports to PDF when button is pressed", () => {
    const { getByText } = render(<PropertyDashboard />);
    const exportButton = getByText("exportTable");
    fireEvent.press(exportButton);
  });
});
