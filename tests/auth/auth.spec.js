import { test, expect } from "@playwright/test";
import { AuthService } from "../../services/authService";

let authService;

test.beforeAll(async () => {
  authService = new AuthService();
  await authService.init();
});

test.afterAll(async () => {
  await authService.dispose();
});

test.describe("Authenticatio of API", () => {
  test("login with valid credentials, returns an access token", async () => {
    const response = await authService.login("emilys", "emilyspass");
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty("accessToken");
    expect(body).toHaveProperty("refreshToken");
    expect(body.username).toBe("emilys");
  });

  test("login with an incorrect password that will return 400 status code", async () => {
    const response = await authService.login("emilys", "xxxx");
    expect(response.status()).toBe(400);
  });

  test("login with an non-existing username that will return 400 status code", async () => {
    const response = await authService.login("not-existed", "xxxx");
    expect(response.status()).toBe(400);
  });
});
