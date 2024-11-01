import { Rotation } from "../../../src/models/rotation";

describe("Rotation", () => {
  it("should create a valid rotation", () => {
    const rotation = new Rotation({
      ID: 1,
      name: "Hr A",
    });

    expect(rotation.ID).toBe(1);
    expect(rotation.name).toBe("Hr A");
  });

  it("should throw error for empty name", () => {
    expect(
      () =>
        new Rotation({
          ID: 1,
          name: "",
        }),
    ).toThrow("Rotation name cannot be empty");
  });

  it("should throw error for invalid name format", () => {
    expect(
      () =>
        new Rotation({
          ID: 1,
          name: "Invalid",
        }),
    ).toThrow('Rotation name must be in format "Hr [A-F]"');
  });
});
