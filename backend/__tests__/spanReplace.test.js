const { extractAndReplace } = require("../spanReplace.cjs");

describe("extractAndReplace", () => {
  test("replaces <c> tags with <span> tags", () => {
    const input =
      "This is a <c type='correction' edit='corrected'>test</c> string.";
    const expectedOutput =
      'This is a <span class="correction tooltip" id="test" data-original="test" data-edit="corrected" onclick="handleSpanClick(\'test\',\'corrected\')">test</span></Tooltip> string.';
    expect(extractAndReplace(input).replace(/\s+/g, " ")).toBe(
      expectedOutput.replace(/\s+/g, " ")
    );
  });

  test("handles multiple <c> tags", () => {
    const input =
      "This is a <c type='correction' edit='corrected'>test</c> string with <c type='correction' edit='another'>another</c> correction.";
    const expectedOutput =
      'This is a <span class="correction tooltip" id="test" data-original="test" data-edit="corrected" onclick="handleSpanClick(\'test\',\'corrected\')">test</span></Tooltip> string with <span class="correction tooltip" id="another" data-original="another" data-edit="another" onclick="handleSpanClick(\'another\',\'another\')">another</span></Tooltip> correction.';
    expect(extractAndReplace(input).replace(/\s+/g, " ")).toBe(
      expectedOutput.replace(/\s+/g, " ")
    );
  });

  test("returns the original text if no <c> tags are present", () => {
    const input = "This is a test string.";
    expect(extractAndReplace(input)).toBe(input);
  });

  test("handles empty input", () => {
    const input = "";
    expect(extractAndReplace(input)).toBe(input);
  });
});
