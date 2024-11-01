import { Category } from "../../../src/models/category";

describe("Category", () => {
  describe("creation", () => {
    it("should create a valid category", () => {
      const category = new Category({
        ID: 1,
        name: "Music",
      });

      expect(category.ID).toBe(1);
      expect(category.name).toBe("Music");
    });

    it("should throw error for empty name", () => {
      expect(
        () =>
          new Category({
            ID: 1,
            name: "",
          }),
      ).toThrow("Category name cannot be empty");
    });

    it("should throw error for name longer than 100 characters", () => {
      const longName = "a".repeat(101);
      expect(
        () =>
          new Category({
            ID: 1,
            name: longName,
          }),
      ).toThrow("Category name cannot exceed 100 characters");
    });
  });

  describe("validation", () => {
    it("should validate a known category name", () => {
      const category = new Category({
        ID: 1,
        name: "Music",
      });
      expect(category.isValidCategoryName()).toBe(true);
    });

    it("should invalidate unknown category names", () => {
      const category = new Category({
        ID: 1,
        name: "InvalidCategory",
      });
      expect(category.isValidCategoryName()).toBe(false);
    });
  });
});
