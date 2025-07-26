import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import App from "./App";

// Mock scrollIntoView to avoid errors in jsdom
Element.prototype.scrollIntoView = jest.fn();

describe("App", () => {
  it("renders export buttons", async () => {
    render(<App loadingDelay={0} />);
    // Wait for the Export CSV button to appear after loading
    await screen.findByText(/export csv/i);
    expect(screen.getByText(/export csv/i)).toBeInTheDocument();
    expect(screen.getByText(/export json/i)).toBeInTheDocument();
  });

  it("paginates foods and navigates pages", async () => {
    render(<App loadingDelay={0} />);
    // Wait for the Export CSV button to appear after loading
    await screen.findByText(/export csv/i);
    // Should show pagination controls
    expect(
      screen.getByRole("button", { name: /next page/i })
    ).toBeInTheDocument();
    // Click next page
    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    // Should still show pagination controls
    expect(
      screen.getByRole("button", { name: /previous page/i })
    ).toBeInTheDocument();
  });
});
