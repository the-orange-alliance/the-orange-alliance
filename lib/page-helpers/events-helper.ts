import { useMemo } from 'react';
import { Event, Week } from '@the-orange-alliance/api/lib/cjs/models';
import TOAProvider from '../../providers/TOAProvider';
import { CURRENT_SEASON } from '../../constants';
import { undefinedToNull } from '../utils/common';

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

export const fetchEventsData = async (): Promise<IRawEventsProps> => {
  const data = await TOAProvider.getAPI().getEvents({ season_key: CURRENT_SEASON });
  data.sort(
    (a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  return {
    events: data.map(e => undefinedToNull(e.toJSON()))
  };
};

export const organizeEventsByWeek = (events: Event[]): Week[] => {
  const tempWeek = {} as { [key: string]: Week };
  for (const event of events) {
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
