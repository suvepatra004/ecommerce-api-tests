import { createApiClient } from "../utils/apiClients";

export class AuthService {
  constructor() {
    this.context = null;
  }

  async init() {
    this.context = await createApiClient();
  }

  async login(username, password, expiresInMins = 60) {
    return this.context.post("/auth/login", {
      data: { username, password, expiresInMins },
    });
  }

  async dispose() {
    await this.context.dispose();
  }
}
