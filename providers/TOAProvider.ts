import { API } from "@the-orange-alliance/api/lib/cjs";

class TOAProvider {
  private static _instance: TOAProvider;

  private readonly api: API;

  public static getInstance(): TOAProvider {
    if (typeof TOAProvider._instance === "undefined") {
      TOAProvider._instance = new TOAProvider();
    }
    return TOAProvider._instance;
  }

  private constructor() {
    this.api = new API("", "TOA-WebApp-1920");
  }

  public getAPI(): API {
    return this.api;
  }
}

export default TOAProvider.getInstance();
