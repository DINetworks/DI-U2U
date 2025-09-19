import axios from "axios";

export default class HttpAdapter {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: "https://v2.api.squidrouter.com",
      timeout: 30000,
      headers: {
        "x-integrator-id": process.env.NEXT_PUBLIC_INTEGRATOR,
      },
    });
  }

  async get(url: string) {
    return await this.axios.get(url);
  }

  async post(url: any, data: any, config: any) {
    return await this.axios.post(url, data, config);
  }
}
