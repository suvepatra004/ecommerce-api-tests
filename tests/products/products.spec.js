/**
 * @website https://dummyjson.com
 * @author Suvendu Kumar Patra
 * @since 27th Sept 2026
 */
import { test, expect } from "@playwright/test";
import { ProductService } from "../../services/productService";
import { loadSchema, validateSchema } from "../../utils/validateSchema";

let productService;
const productSchema = loadSchema("product.schema.json");

test.beforeAll(async () => {
  productService = new ProductService();
  await productService.init();
});

test.afterAll(async () => {
  await productService.dispose();
});

test.describe("Products API Validation", () => {
  test("GET /products endpoing returns 200 and a list of products information", async ({}) => {
    const response = await productService.getAll();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.products.length).toBeGreaterThan(0);
    expect(Array.isArray(data.products)).toBeDefined();
  });

  test("GET /products endpoint response schema validation", async () => {
    const response = await productService.getAll();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.products.length).toBeGreaterThan(0);
    expect(Array.isArray(data.products)).toBeDefined();

    const product = data.products[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("title");
    expect(product).toHaveProperty("price");
    expect(typeof product.price).toBe("number");
  });
  test("GET /products/:id returns specific product", async () => {
    const response = await productService.getById(1);
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.id).toEqual(1);
  });
  test("GET /products/:id returns 404 for non existing id", async () => {
    const response = await productService.getById(989); // invalid product id
    expect(response.status()).toBe(404);
  });

  test("GET /products/:id response matches the product schema", async () => {
    const response = await productService.getById(1);
    const body = await response.json();

    const { valid, errors } = validateSchema(body, productSchema);
    expect(valid, JSON.stringify(errors)).toBe(true);
  });
});
