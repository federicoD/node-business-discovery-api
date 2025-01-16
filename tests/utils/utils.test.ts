import { isNullOrUndefinedOrEmptyOrNotNumber } from "../../src/utils/utils";

describe("isNullOrUndefinedOrEmptyOrNotNumber", () => {
  it("Returns true when string is empty", () => {
    const result = isNullOrUndefinedOrEmptyOrNotNumber("");
    expect(result).toEqual(true);
  });

  it("Returns true when undefined", () => {
    const result = isNullOrUndefinedOrEmptyOrNotNumber(undefined);
    expect(result).toEqual(true);
  });

  it("Returns true when string is not a number", () => {
    const result = isNullOrUndefinedOrEmptyOrNotNumber("test");
    expect(result).toEqual(true);
  });

  it("Returns false when string is a number", () => {
    const result = isNullOrUndefinedOrEmptyOrNotNumber("123");
    expect(result).toEqual(false);
  });
});