import React, { Component } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginButton from "../login_button";
import { useAuth0 } from "@auth0/auth0-react";
import "@testing-library/jest-dom";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(),
}));

describe("LoginButton", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({ loginWithRedirect: jest.fn() });
  });

  it("renders LoginIcon when isListOpen is false", () => {
    render(<LoginButton isListOpen={false} />);
    const logoutIcon = screen.getByTestId("LoginIcon");
    expect(logoutIcon).toBeInTheDocument();
  });

  it("renders LoginIcon and text when isListOpen is true", () => {
    render(<LoginButton isListOpen={true} />);
    const logoutIcon = screen.getByTestId("LoginIcon");
    const logoutText = screen.getByText("Login");
    expect(logoutIcon).toBeInTheDocument();
    expect(logoutText).toBeInTheDocument();
  });

  it("calls login function on button click", () => {
    const { loginWithRedirect } = useAuth0();
    render(<LoginButton isListOpen={false} />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    expect(loginWithRedirect).toHaveBeenCalledTimes(1);
  });
});
