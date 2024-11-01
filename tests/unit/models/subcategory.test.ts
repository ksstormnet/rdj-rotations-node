import { Subcategory } from "../../../src/models/subcategory";

describe("Subcategory", () => {
  describe("creation", () => {
    it("should create a valid subcategory", () => {
      const subcategory = new Subcategory({
        ID: 1,
        parentid: 1,
        name: "CE - Core Early - 78 to 83",
      });

      expect(subcategory.ID).toBe(1);
      expect(subcategory.parentid).toBe(1);
      expect(subcategory.name).toBe("CE - Core Early - 78 to 83");
    });

    it("should throw error for empty name", () => {
      expect(
        () =>
          new Subcategory({
            ID: 1,
            parentid: 1,
            name: "",
          }),
      ).toThrow("Subcategory name cannot be empty");
    });

    it("should throw error for name longer than 100 characters", () => {
      const longName = "a".repeat(101);
      expect(
        () =>
          new Subcategory({
            ID: 1,
            parentid: 1,
            name: longName,
          }),
      ).toThrow("Subcategory name cannot exceed 100 characters");
    });

    it("should throw error for invalid parent ID", () => {
      expect(
        () =>
          new Subcategory({
            ID: 1,
            parentid: -1,
            name: "Test",
          }),
      ).toThrow("Parent ID must be positive");
    });
  });

  describe("validation", () => {
    it("should extract code from subcategory name", () => {
      const subcategory = new Subcategory({
        ID: 1,
        parentid: 1,
        name: "CE - Core Early - 78 to 83",
      });
      expect(subcategory.getCode()).toBe("CE");
    });

    it("should handle subcategory names without codes", () => {
      const subcategory = new Subcategory({
        ID: 1,
        parentid: 1,
        name: "ID Jingle",
      });
      expect(subcategory.getCode()).toBe("ID");
    });
  });
});
