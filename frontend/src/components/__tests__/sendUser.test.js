import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { setAuth } from "../../app/actions";
// Mock axios to control its behavior during the test
jest.mock("axios");

describe("SendUser", () => {
  // Test successful user sending
  it("sends user data and dispatches setAuth on success", async () => {
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      isAuthenticated: true,
    };

    const mockDispatch = jest.fn();
    const mockAxiosPost = jest.fn().mockResolvedValue({ status: 200 });
    axios.post = mockAxiosPost;

    const { result, waitForNextUpdate } = renderHook(() => ({
      user: mockUser,
      dispatch: mockDispatch,
    }));

    await waitForNextUpdate(); // Wait for useEffect to run

    expect(mockAxiosPost).toHaveBeenCalledWith("/user", mockUser);
    expect(mockDispatch).toHaveBeenCalledWith(
      setAuth(mockUser.isAuthenticated, mockUser)
    );
  });

  // Test unsuccessful user sending
  it("handles errors during user data sending", async () => {
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      isAuthenticated: true,
    };

    const mockDispatch = jest.fn();
    const mockError = new Error("Network Error");
    const mockAxiosPost = jest.fn().mockRejectedValue(mockError);
    axios.post = mockAxiosPost;

    const { result, waitForNextUpdate } = renderHook(() => ({
      user: mockUser,
      dispatch: mockDispatch,
    }));

    await waitForNextUpdate(); // Wait for useEffect to run

    expect(mockAxiosPost).toHaveBeenCalledWith("/user", mockUser);
    expect(console.error).toHaveBeenCalledWith(
      "Error sending user data:",
      mockError
    );
  });
});
