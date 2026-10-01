// fixtures/test-fixtures.js
import { test as base } from "@playwright/test";
import { ProductService } from "../services/productService.js";
import { AuthService } from "../services/authService.js";
import { CartService } from "../services/cartService.js";

const TEST_USER = {
  username: "emilys",
  password: "emilyspass",
};

export const test = base.extend({
  productService: async ({}, use) => {
    const service = new ProductService();
    await service.init();
    await use(service);
    await service.dispose();
  },

  authenticatedCart: async ({}, use) => {
    const authService = new AuthService();
    await authService.init();

    const loginResponse = await authService.login(
      TEST_USER.username,
      TEST_USER.password,
    );
    const { accessToken, id: userId } = await loginResponse.json();

    const cartService = new CartService(accessToken);
    await cartService.init();

    await use({ cartService, userId });

    await cartService.dispose();
    await authService.dispose();
  },
});

export { expect } from "@playwright/test";
