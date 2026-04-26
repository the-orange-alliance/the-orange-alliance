import { useMemo } from 'react';
import { Event, Week } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '@/providers/toa-provider';
import { CURRENT_SEASON } from '@/constants';
import { undefinedToNull } from '@/lib/utils/common';

export interface IRawEventsProps {
  events: any[];
}

export interface IEventsProps {
  events: Event[];
}

export const parseEventsProps = (props: IRawEventsProps): IEventsProps => {
  return {
    events: props.events.map((e: any) => new Event().fromJSON(e))
  };
};

export const useEventsData = (props: IRawEventsProps): IEventsProps =>
  useMemo(() => parseEventsProps(props), [props]);

const getApiBase = () =>
  typeof window === 'undefined' && process.env.INTERNAL_API_URL
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || 'https://api.theorangealliance.org');

export const fetchEventsData = async (): Promise<IRawEventsProps> => {
  try {
    const res = await fetch(
      `${getApiBase()}/event?season_key=${CURRENT_SEASON}&includeTeamCount=true`,
      { headers: { 'x-application-origin': 'TOA-WebApp-1920' } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return { events: [] };
    const events = data.map((e: any) => new Event().fromJSON(e));
    events.sort(
      (a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return {
      events: events.map(e => ({
        ...undefinedToNull(e.toJSON()),
        team_count: (e as any).teamCount,
        match_count: (e as any).matchCount
      }))
    };
  } catch {
    return { events: [] };
  }
};

export const organizeEventsByWeek = (events: Event[]): Week[] => {
  const tempWeek = {} as { [key: string]: Week };
  for (const event of events) {
    if (!event.weekKey) continue; // Skip events without a week key
    if (tempWeek[event.weekKey] === undefined) {
      tempWeek[event.weekKey] = {
        weekKey: event.weekKey,
        startDate: event.startDate,
        endDate: event.endDate
      };
    } else {
      tempWeek[event.weekKey].endDate = event.endDate;
    }
  }
  return Object.values(tempWeek);
};
