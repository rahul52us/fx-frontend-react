import { formatTableDate, isTableDateColumn } from "./dateUtils";

describe("dateUtils", () => {
  it("keeps decimal BMK values as decimals instead of converting dots to dashes", () => {
    expect(formatTableDate("92.292")).toBe("92.292");
    expect(formatTableDate(92.292)).toBe("92.292");
  });

  it("does not treat BMK date fields as regular date columns", () => {
    expect(isTableDateColumn({ key: "spotOnBmkDate" })).toBe(false);
    expect(isTableDateColumn({ key: "premiumOnBmkDate" })).toBe(false);
  });
});
