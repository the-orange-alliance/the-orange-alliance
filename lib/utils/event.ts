import Event from '@the-orange-alliance/api/lib/cjs/models/Event';

export class EventFilter {
  private events: Event[];
  private eventsFiltered: Event[];

  constructor(events: any) {
    this.events = events;
    this.eventsFiltered = [];
  }

  public setEvents(events: Event[]) {
    this.events = events;
  }

  public filterArray(query: string) {
    if (query && query.trim() !== '') {
      this.eventsFiltered = this.events.filter((event: Event) => {
        return (event.regionKey || 'null').toLowerCase() === query.toLowerCase();
      });
    } else {
      this.eventsFiltered = this.events;
    }
  }

  public searchFilter(query: string) {
    if (query && query.trim() !== '' && query !== null) {
      this.eventsFiltered = this.events.filter(event => {
        query = query.toLowerCase();

        const eventRegion = (event.regionKey || 'null').toLowerCase();
        const eventCity = (event.city + '' || 'null').toLowerCase();
        const eventStateProv = (event.stateProv + '' || 'null').toLowerCase();
        const eventCountry = (event.country + '' || 'null').toLowerCase();
        const eventName = (event.eventName || 'null').toLowerCase();
        const eventKey = (event.eventKey || 'null').toLowerCase();

        const containsRegion = eventRegion.indexOf(query) > -1;
        const containsCity = eventCity.indexOf(query) > -1;
        const containsStateProv = eventStateProv.indexOf(query) > -1;
        const containsCountry = eventCountry.indexOf(query) > -1;
        const containsName = eventName.indexOf(query) > -1;
        const someKey = eventKey === query;

        return (
          containsRegion ||
          containsCity ||
          containsStateProv ||
          containsCountry ||
          containsName ||
          someKey
        );
      });
    } else {
      this.eventsFiltered = this.events;
    }
    this.eventsFiltered.sort((a: Event, b: Event) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }

  public getOriginalArray() {
    return this.events;
  }

  public getFilteredArray() {
    return this.eventsFiltered;
  }
}

export function eventToStrippedJson(event: Event) {
  return {
    event_key: event.eventKey,
    season_key: event.seasonKey,
    region_key: event.regionKey,
    league_key: event.leagueKey,
    event_code: event.eventCode,
    event_type_key: event.eventTypeKey,
    division_name: event.divisionName,
    first_event_code: event.firstEventCode,
    event_name: event.eventName,
    start_date: event.startDate,
    end_date: event.endDate,
    week_key: event.weekKey,
    city: event.city,
    state_prov: event.stateProv,
    country: event.country
  };
}

// tslint:disable-next-line:max-classes-per-file
export class EventSorter {
  public sort(items: Event[]) {
    items.sort((a, b) => {
      const date1 = new Date(a.startDate);
      const date2 = new Date(b.startDate);
      return date1 > date2 ? 1 : date2 > date1 ? -1 : 0;
    });
    return items;
  }
}
