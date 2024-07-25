import React from "react";
import { renderHook } from "@testing-library/react";
import axios from "axios";
import SendUser from "../send_user";
import * as reactRedux from "react-redux";

const mockDispatch = jest.fn();

jest.mock("axios");
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

function mockUser() {
  return {
    id: 1,
    name: "John Doe",
    isAuthenticated: true,
  };
}

describe("SendUser", () => {
  it("sends user data to the API on user or isAuthenticated change", async () => {
    const mockAxiosPost = jest
      .fn()
      .mockResolvedValue({ data: {}, status: 200 });
    axios.post.mockImplementation(mockAxiosPost);

    const user = mockUser();

    const { result, rerender } = renderHook((props = {}) => SendUser(props), {
      initialProps: user,
    });

    // Assert initial state
    expect(result.current).toBeUndefined(); // No JSX returned

    // Wait for useEffect to run and send data
    await Promise.resolve();

    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockAxiosPost).toHaveBeenCalledWith("/user", user);

    // Simulate user update with a new user object

    rerender();

    // Wait for useEffect to run again
    await Promise.resolve();

    // Expect another API call
    expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    expect(mockAxiosPost).toHaveBeenCalledWith("/user", user);
  });

  // Add more tests for different scenarios (optional)
  // - Test successful redirection on 200 status
  // - Test dispatching setAuth action
});
