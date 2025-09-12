import { ensureHttps, cleanTitle, mapHitToCard, mapRecipeRowToCard } from "./mapToCard";

describe("ensureHttps", () => {
  it("converts http to https", () => {
    expect(ensureHttps("http://www.edamam.com/image.jpg")).toBe("https://www.edamam.com/image.jpg");
  });

  it("leaves https unchanged", () => {
    expect(ensureHttps("https://www.edamam.com/image.jpg")).toBe(
      "https://www.edamam.com/image.jpg",
    );
  });

  it("handles undefined/null", () => {
    expect(ensureHttps(undefined)).toBeUndefined();
    expect(ensureHttps(null)).toBeUndefined();
    expect(ensureHttps("")).toBeUndefined();
  });

  it("returns original for invalid URLs", () => {
    expect(ensureHttps("not-a-url")).toBe("not-a-url");
  });
});

describe("cleanTitle", () => {
  it("returns good titles unchanged", () => {
    expect(cleanTitle("Chocolate Cake")).toBe("Chocolate Cake");
    expect(cleanTitle("Recipe: Pasta Carbonara")).toBe("Recipe: Pasta Carbonara");
  });

  it("cleans URL titles using source URL", () => {
    expect(cleanTitle("http://example.com/recipe", "http://foodblog.com/recipe")).toBe(
      "Recipe from foodblog.com",
    );
  });

  it("cleans URL titles without source URL", () => {
    expect(cleanTitle("https://example.com/recipe")).toBe("Recipe");
  });

  it("removes www from domain", () => {
    expect(cleanTitle("http://bad", "http://www.foodblog.com/recipe")).toBe(
      "Recipe from foodblog.com",
    );
  });

  it("handles null/undefined", () => {
    expect(cleanTitle(null, null)).toBe("Recipe");
    expect(cleanTitle(undefined, undefined)).toBe("Recipe");
  });
});

describe("mapHitToCard", () => {
  it("maps a complete hit to card data", () => {
    const hit = {
      id: "123",
      slug: "chocolate-cake",
      title: "Chocolate Cake",
      imageUrl: "http://www.edamam.com/image.jpg",
      tags: ["dessert", "chocolate"],
      total_minutes: 45,
      hearts: 10,
      avg_rating: 4.5,
      source_url: "http://foodblog.com/recipe",
    };

    const card = mapHitToCard(hit);

    expect(card).toEqual({
      id: "123",
      slug: "chocolate-cake",
      title: "Chocolate Cake",
      imageUrl: "https://www.edamam.com/image.jpg",
      tags: ["dessert", "chocolate"],
      total_minutes: 45,
      hearts: 10,
      rating: 4.5,
      href: "/recipe/chocolate-cake",
      sourceHost: "foodblog.com",
    });
  });

  it("handles missing fields gracefully", () => {
    const hit = {
      id: "456",
      title: "Pasta",
    };

    const card = mapHitToCard(hit);

    expect(card.id).toBe("456");
    expect(card.slug).toBe("456");
    expect(card.title).toBe("Pasta");
    expect(card.imageUrl).toBeUndefined();
    expect(card.tags).toEqual([]);
    expect(card.hearts).toBeUndefined();
  });

  it("cleans bad titles", () => {
    const hit = {
      id: "789",
      title: "http://example.com/recipe",
      source_url: "http://realsite.com/recipe",
    };

    const card = mapHitToCard(hit);
    expect(card.title).toBe("Recipe from realsite.com");
  });
});

describe("mapRecipeRowToCard", () => {
  it("maps database row to card data", () => {
    const row = {
      id: "db-123",
      slug: "db-recipe",
      title: "Database Recipe",
      image_url: "http://images.com/pic.jpg",
      tags: ["quick"],
      total_minutes: 30,
      avg_rating: 4.0,
      hearts: 5,
    };

    const card = mapRecipeRowToCard(row);

    expect(card.id).toBe("db-123");
    expect(card.slug).toBe("db-recipe");
    expect(card.title).toBe("Database Recipe");
    expect(card.imageUrl).toBe("https://images.com/pic.jpg");
    expect(card.hearts).toBe(5);
  });
});
