import { createApiClient } from "../utils/apiClient.js";

export class CartService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.context = null;
  }

  async init() {
    this.context = await createApiClient(this.accessToken);
  }

  async getUserCarts(userId) {
    return this.context.get(`/carts/user/${userId}`);
  }

  async addCart(userId, products) {
    return this.context.post("/carts/add", {
      data: { userId, products },
    });
  }

  async dispose() {
    await this.context.dispose();
  }
}
