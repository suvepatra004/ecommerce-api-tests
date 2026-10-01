import { test, expect } from "../../fixtures/test-fixtures.js";

test.describe("Cart API", () => {
  test("add products to cart for the logged-in user", async ({
    authenticatedCart,
  }) => {
    const { cartService, userId } = authenticatedCart;

    const response = await cartService.addCart(userId, [
      { id: 1, quantity: 3 },
      { id: 2, quantity: 5 },
    ]);
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.userId).toBe(userId);
    expect(body.products.length).toBe(2);
  });

  test("get carts for the logged-in user", async ({ authenticatedCart }) => {
    const { cartService, userId } = authenticatedCart;

    const response = await cartService.getUserCarts(userId);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.carts)).toBe(true);
  });

  test("get carts for a user with no cart returns 404", async ({
    authenticatedCart,
  }) => {
    const { cartService } = authenticatedCart;

    const response = await cartService.getUserCarts(999999);
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty("message");
  });
});
