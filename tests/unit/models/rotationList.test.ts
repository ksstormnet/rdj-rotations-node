import { RotationList } from "../../../src/models/rotationList";

describe("RotationList", () => {
  it("should create a valid rotation list item", () => {
    const item = new RotationList({
      ID: 1,
      pID: 1, // parent rotation ID
      catID: 1, // category ID
      subID: 45, // subcategory ID
      genID: 0, // default genre ID
      ord: 0, // sequence in rotation
      data: "CE", // shorthand label
      repeatRule: "False",
      selType: 0,
      sweeper: 0,
      track_separation: 0,
      artist_separation: 0,
      title_separation: 0,
      album_separation: 0,
    });

    expect(item.ID).toBe(1);
    expect(item.pID).toBe(1);
    expect(item.catID).toBe(1);
    expect(item.subID).toBe(45);
    expect(item.ord).toBe(0);
  });

  it("should throw error for negative order", () => {
    expect(
      () =>
        new RotationList({
          ID: 1,
          pID: 1,
          catID: 1,
          subID: 45,
          genID: 0,
          ord: -1,
          data: "CE",
          repeatRule: "False",
          selType: 0,
          sweeper: 0,
          track_separation: 0,
          artist_separation: 0,
          title_separation: 0,
          album_separation: 0,
        }),
    ).toThrow("Order must be non-negative");
  });
});
