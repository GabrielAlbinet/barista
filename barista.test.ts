import { beforeEach, describe, expect, it } from "vitest";
import { Coffee } from "./barista";
import { Ingredient } from "./barista";
import { Barista } from "./barista";

describe("Coffee", () => {
  it("crée un café avec un nom et un prix", () => {
    const coffee = new Coffee("Cappuccino", 4);

    expect(coffee.name).toBe("Cappuccino");
    expect(coffee.price).toBe(4);
  });

  it("ajoute un ingrédient à la recette", () => {
    const coffee = new Coffee("Cappuccino", 4);

    coffee.addIngredient("Lait", 10);

    expect(coffee.ingredients).toHaveLength(1);
    expect(coffee.ingredients[0]).toEqual({ name: "Lait", quantity: 10 });
  });
});

describe("Ingredient", () => {
  it("ajoute une quantité au stock", () => {
    const ingredient = new Ingredient("Lait", 10);

    ingredient.addQuantity(5);

    expect(ingredient.quantity).toBe(15);
  });

  it("retire une quantité du stock", () => {
    const ingredient = new Ingredient("Lait", 10);

    const result = ingredient.removeQuantity(5);

    expect(result).toBe(true);
    expect(ingredient.quantity).toBe(5);
  });

  it("refuse de retirer une quantité supérieure au stock", () => {
    const ingredient = new Ingredient("Lait", 10);

    const result = ingredient.removeQuantity(11);

    expect(result).toBe(false);
    expect(ingredient.quantity).toBe(10);
  });
});

describe("Barista", () => {
  let barista: Barista;
  let cappuccino: Coffee;

  beforeEach(() => {
    barista = new Barista("Barry Sta");
    cappuccino = new Coffee("Cappucino", 35.5);
    cappuccino.addIngredient("café", 1);
    cappuccino.addIngredient("lait", 3);
  });

  it("ajoute un café à sa liste de cafés", () => {
    barista.addCoffee(cappuccino);

    expect(barista.listCoffees()).toContain(cappuccino);
    expect(barista.getCoffee("Cappucino")).toBe(cappuccino);
  });

  it("retourne undefined lorsqu'un café n'existe pas", () => {
    expect(barista.getCoffee("On a pas ce café là chef")).toBeUndefined();
  });

  it("peut préparer un café lorsque tous les ingrédients sont disponibles", () => {
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 10);

    expect(barista.canMakeCoffee(cappuccino)).toBe(true);
  });

  it("ne peut pas préparer un café lorsqu'un ingrédient est manquant", () => {
    barista.addIngredient("café", 5);

    expect(barista.canMakeCoffee(cappuccino)).toBe(false);
  });

  it("ne peut pas préparer un café lorsque la quantité est insuffisante", () => {
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 1);

    expect(barista.canMakeCoffee(cappuccino)).toBe(false);
  });

  it("consomme les ingrédients lorsqu'il prépare un café", () => {
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 10);

    const preparation = barista.makeCoffee(cappuccino);

    expect(preparation).toBe(true);
    expect(barista.ingredients.find(i => i.name === "café")?.quantity).toBe(4);
    expect(barista.ingredients.find(i => i.name === "lait")?.quantity).toBe(7);

  });

  it("ne consomme rien lorsqu'il ne peut pas préparer le café", () => {
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 1);

    const preparation = barista.makeCoffee(cappuccino);

    expect(preparation).toBe(false);
  });
  
  it("retourne null lorsque les ingrédients sont insuffisants", () => {
  barista.addCoffee(cappuccino);
  barista.addIngredient("café", 5);

  expect(barista.orderCoffee("Cappuccino")).toBeNull();
  });

  it("retourne le prix lorsqu'un café est commandé", () => {
    barista.addCoffee(cappuccino);
    barista.addIngredient("café", 5);
    barista.addIngredient("lait", 10);

    expect(barista.orderCoffee(cappuccino.name)).toBe(35.5);
  });

  it("ajouter de la quantité à un ingrédient déjà là dans le stock du Barista (sans dupliquer)", () => {
  barista.addIngredient("café", 5);
  barista.addIngredient("café", 3);

  expect(barista.ingredients).toHaveLength(1);
  expect(barista.ingredients[0].quantity).toBe(8);
});
});
