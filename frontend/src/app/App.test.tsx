import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "@/app/App";

describe("App", () => {
  it("redirige a /dashboard y muestra el layout principal", () => {
    render(<App />);

    expect(screen.getByText("ADN-Soporte")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
