import { createApiClient } from "../utils/apiClients";

export class ProductService {
  constructor() {
    this.context = null;
  }

  async init() {
    this.context = await createApiClient();
  }

  async getAll(params = {}) {
    return this.context.get("/products", { params });
  }

  async getById(id) {
    return this.context.get(`/products/${id}`);
  }

  async dispose() {
    await this.context.dispose();
  }
}
