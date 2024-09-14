import { API } from '@the-orange-alliance/api/lib/cjs';

class TOAProvider {
  private static _instance: TOAProvider;

  private readonly api: API;

  public static getInstance(): TOAProvider {
    if (typeof TOAProvider._instance === 'undefined') {
      TOAProvider._instance = new TOAProvider();
    }
    return TOAProvider._instance;
  }

  private constructor() {
    this.api = new API('', 'TOA-WebApp-1920');
  }

  public getAPI(): API {
    // Use local request if we're on the backend
    if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
      this.api.setCustomUrl('http://127.0.0.1:8008/api');
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      this.api.setCustomUrl(process.env.NEXT_PUBLIC_API_URL);
    }
    return this.api;
  }
}

export default TOAProvider.getInstance();
