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

    // The API joins each event participant, ranking and award to a team. When a
    // team_key has no matching team the join yields null, and the models call
    // Team.fromJSON(null) without a guard, which throws and takes down whichever
    // page asked for it. Drop those rows here, before the models see them.
    const origArrToObj = (this.api as any).arrToObj.bind(this.api);
    (this.api as any).arrToObj = function (model: any, text: string) {
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          console.error('[TOA] Non-array API response:', JSON.stringify(parsed).slice(0, 400));
          return origArrToObj(model, text);
        }
        // The API drops null fields, so a failed join leaves `team` absent entirely.
        // EventParticipant.fromJSON and Ranking.fromJSON both dereference it without
        // a guard; AwardRecipient already checks, so leave award rows alone.
        const clean = parsed.filter((row: any) => {
          if (!row) return true;
          if (
            row.team == null &&
            (row.event_participant_key !== undefined || row.rank_key !== undefined)
          ) {
            return false;
          }
          // Same story for alliances: Alliance.fromJSON guards pick2 but not the
          // captain or pick1, so an alliance built on a team we cannot resolve
          // takes the page down. An alliance with no captain is not worth showing.
          if (row.seed !== undefined && (row.captain == null || row.pick1 == null)) {
            return false;
          }
          return true;
        });
        if (clean.length !== parsed.length) {
          console.warn(
            `[TOA] dropped ${parsed.length - clean.length} row(s) with no matching team`
          );
          return origArrToObj(model, JSON.stringify(clean));
        }
      } catch (e) {
        console.error('[TOA] JSON parse failed on:', String(text).slice(0, 400));
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
