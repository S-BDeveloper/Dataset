import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock the data hooks
jest.mock("./hooks/useFacts", () => ({
  useMiracles: () => ({
    miracles: [
      {
        type: "scientific",
        title: "Test Miracle",
        notes: "Test description",
        sources: { primary: "Test source" },
      },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock("./hooks/useFactFilters", () => ({
  useMiracleFilters: () => ({
    filters: { searchTerm: "", type: "", sortBy: "title" },
    setFilters: jest.fn(),
    types: ["scientific"],
    paginatedMiracles: [
      {
        type: "scientific",
        title: "Test Miracle",
        notes: "Test description",
        sources: { primary: "Test source" },
      },
    ],
    sortedMiracles: [
      {
        type: "scientific",
        title: "Test Miracle",
        notes: "Test description",
        sources: { primary: "Test source" },
      },
    ],
    currentPage: 1,
    setCurrentPage: jest.fn(),
    totalPages: 1,
    goToPage: "1",
    setGoToPage: jest.fn(),
    handleGoToPage: jest.fn(),
  }),
}));

// Mock scrollIntoView to avoid errors in jsdom
Element.prototype.scrollIntoView = jest.fn();

describe("App", () => {
  it("renders the main application", async () => {
    render(<App loadingDelay={0} />);

    // Check for main app elements
    expect(
      screen.getByText(/authentic islamic knowledge/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/export csv/i)).toBeInTheDocument();
    expect(screen.getByText(/export json/i)).toBeInTheDocument();
  });

  it("shows export buttons after loading", async () => {
    render(<App loadingDelay={0} />);

    // Wait for the Export CSV button to appear after loading
    await screen.findByText(/export csv/i);
    expect(screen.getByText(/export csv/i)).toBeInTheDocument();
    expect(screen.getByText(/export json/i)).toBeInTheDocument();
  });

  it("handles export functionality", async () => {
    render(<App loadingDelay={0} />);

    // Wait for export buttons to appear
    await screen.findByText(/export csv/i);

    // Click export buttons
    fireEvent.click(screen.getByText(/export csv/i));
    fireEvent.click(screen.getByText(/export json/i));

    // Should not throw errors
    expect(screen.getByText(/export csv/i)).toBeInTheDocument();
  });
});
