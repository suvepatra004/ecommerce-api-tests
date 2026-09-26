/**
 * @website https://dummyjson.com
 * @author Suvendu Kumar Patra
 * @since 27th Sept 2026
 */
import { test, expect } from "@playwright/test";
import { ProductService } from "../../services/productService";

let productService;

test.beforeAll(async () => {
  productService = new ProductService();
  await productService.init();
});

test.afterAll(async () => {
  await productService.dispose();
});

test.describe("Products API Validation", () => {
  test("GET /products endpoing returns 200 and a list of products information", async ({
    request,
  }) => {
    const response = await productService.getAll();
    expect(response.status()).toBe(200);
  });
});
