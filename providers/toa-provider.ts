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

    // Debug logging: intercept arrToObj to log raw API responses before parse
    const origArrToObj = (this.api as any).arrToObj.bind(this.api);
    (this.api as any).arrToObj = function (model: any, text: string) {
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          console.error('[TOA-DEBUG] Non-array API response:', JSON.stringify(parsed).slice(0, 800));
        } else {
          console.log('[TOA-DEBUG] OK array response, length:', parsed.length);
        }
      } catch (e) {
        console.error('[TOA-DEBUG] JSON parse failed on:', String(text).slice(0, 800));
      }
      return origArrToObj(model, text);
    };
  }

  public getAPI(): API {
    // Use local request if we're on the backend
    if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
      const url = process.env.INTERNAL_API_URL + '/api';
      console.log('[TOA-DEBUG] SSR: setCustomUrl ->', url);
      this.api.setCustomUrl(url);
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      this.api.setCustomUrl(process.env.NEXT_PUBLIC_API_URL);
    }
    return this.api;
  }
}

export default TOAProvider.getInstance();

