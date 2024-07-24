jest.mock("sqlite3", () => {
  const mSqlite3 = {
    Database: jest.fn().mockImplementation((_, callback) => {
      callback(null); // Simulate successful connection
      return {};
    }),
    verbose: jest.fn().mockReturnThis(),
  };
  return mSqlite3;
});

const sqlite3 = require("sqlite3").verbose();
const { connectToDatabase } = require("../dbConnect"); // Replace with actual path

test("connects to database successfully", () => {
  const mockConsoleLog = jest.spyOn(console, "log"); // Spy on console.log

  connectToDatabase();

  expect(mockConsoleLog).toHaveBeenCalledWith(
    "Connected to the SQLite database."
  );
});
