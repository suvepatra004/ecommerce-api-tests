import { createApiClient } from "../utils/apiClients.js";

export class ProductService {
  constructor() {
    this.context = null;
  }

  async init() {
    this.context = await createApiClient();
  }

  async getAll(params = {}) {
    if (!this.context) {
      throw new Error("ProductService is not initialized");
    }

    return await this.context.get("/products", { params });
  }

  async getById(id) {
    if (!this.context) {
      throw new Error("ProductService is not initialized");
    }

    return await this.context.get(`/products/${id}`);
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
  }
}
