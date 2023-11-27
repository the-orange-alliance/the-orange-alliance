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
    // this.api.setCustomUrl('http://localhost:8008/api');
  }

  public getAPI(): API {
    // Use local request if we're on the backend
    if (typeof window === 'undefined') this.api.setCustomUrl('http://127.0.0.1:8008/api');
    else this.api.setCustomUrl('https://api.theorangealliance.org');
    return this.api;
  }
}

export default TOAProvider.getInstance();
