import { Match } from '@the-orange-alliance/api/lib/cjs/models';
import { MatchType } from '@/lib/utils/match';

// FTCVideos.org cuts match clips out of event livestreams. Its public API (CORS *) names a match
// the way FIRST does: https://ftcvideos.org/api/v1/match?season=&event=&level=&series=&number=
const FTCVIDEOS_API = 'https://ftcvideos.org/api/v1';
const TIMEOUT_MS = 5000;

export interface FTCVideosMatch {
  embedUrl: string;
  pageUrl: string;
  video: { youtubeId: string; start: number; end: number | null; url: string } | null;
}

export interface FTCVideosRobot {
  gif: string;
  pageUrl: string;
}

// FTCVideos seasons are the year the season starts: 2526 is 2025.
const ftcVideosSeason = (seasonKey: string): string | null =>
  /^\d{4}$/.test(seasonKey) ? String(2000 + parseInt(seasonKey.slice(0, 2), 10)) : null;

// The FTCVideos query of a TOA match, or null for one it cannot name.
//   2526-CMP-P12-Q003-1  -> level=qual&number=3
//   2526-TX-FMQ-E1001-1  -> level=playoff&series=10&number=1 (bracket match 10, game 1)
// Only the double elimination brackets (tournament levels 201 and up, since 2023-24) are mapped;
// the older quarterfinal/semifinal/final series are not.
export const ftcVideosMatchQuery = (match: Match): string | null => {
  const season = ftcVideosSeason(match.event?.seasonKey ?? '');
  const event = match.event?.firstEventCode;
  const part = match.matchKey.split('-')[3] ?? '';
  const n = parseInt(part.slice(1), 10);
  if (!season || !event || isNaN(n)) return null;

  const query = new URLSearchParams({ season, event });
  if (match.tournamentLevel === MatchType.QUALS_MATCH && part[0] === 'Q') {
    query.set('level', 'qual');
    query.set('number', String(n));
  } else if (match.tournamentLevel > 200 && part[0] === 'E') {
    query.set('level', 'playoff');
    query.set('series', String(Math.floor(n / 100)));
    query.set('number', String(n % 100));
  } else {
    return null;
  }
  return query.toString();
};

// GET an FTCVideos API path; null on any failure or after TIMEOUT_MS.
const get = async <T>(path: string, signal?: AbortSignal): Promise<T | null> => {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, TIMEOUT_MS);
  signal?.addEventListener('abort', abort);
  try {
    const res = await fetch(`${FTCVIDEOS_API}/${path}`, { signal: controller.signal });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
};

// The FTCVideos video of a match, or null when it has none.
export const fetchFTCVideosMatch = async (
  match: Match,
  signal?: AbortSignal
): Promise<FTCVideosMatch | null> => {
  const query = ftcVideosMatchQuery(match);
  if (!query) return null;
  const data = await get<FTCVideosMatch>(`match?${query}`, signal);
  return data?.video && data.embedUrl?.startsWith('https://ftcvideos.org/') ? data : null;
};

// The FTCVideos robot GIF of a team in a season, or null when it has none.
export const fetchFTCVideosRobot = async (
  seasonKey: string,
  teamNumber: number,
  signal?: AbortSignal
): Promise<FTCVideosRobot | null> => {
  const season = ftcVideosSeason(seasonKey);
  if (!season || !teamNumber) return null;
  const data = await get<FTCVideosRobot>(`robot?season=${season}&team=${teamNumber}`, signal);
  return data?.gif?.startsWith('https://ftcvideos.org/') && data.pageUrl ? data : null;
};
