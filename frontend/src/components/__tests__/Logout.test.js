import React, { Component } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "../logout_button";
import { useAuth0 } from "@auth0/auth0-react";
import "@testing-library/jest-dom";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({ logout: jest.fn() });
  });

  it("renders LogoutIcon when isListOpen is false", () => {
    render(<LogoutButton isListOpen={false} />);
    const logoutIcon = screen.getByTestId("LogoutIcon");
    expect(logoutIcon).toBeInTheDocument();
  });

  it("renders LogoutIcon and text when isListOpen is true", () => {
    render(<LogoutButton isListOpen={true} />);
    const logoutIcon = screen.getByTestId("LogoutIcon");
    const logoutText = screen.getByText("Logout");
    expect(logoutIcon).toBeInTheDocument();
    expect(logoutText).toBeInTheDocument();
  });

  it("calls logout function on button click", () => {
    const { logout } = useAuth0();
    render(<LogoutButton isListOpen={false} />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
