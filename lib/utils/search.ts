import { Team, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { EventFilter } from './event';

export const performSearch = (
  search: string,
  teams: Team[],
  events: Event[],
  maxResults: number
): { teams: Team[]; events: Event[] } => {
  const query = search && search.trim().length > 0 ? search.toLowerCase().trim() : null;
  if (!query) return { teams: [], events: [] };

  const eventsFilter: EventFilter = new EventFilter(events);

  let teamSearchResults = teams.filter(
    team =>
      String(team.teamKey).includes(query) ||
      (team.teamNameShort && team.teamNameShort.toLowerCase().includes(query))
  );
  teamSearchResults = teamSearchResults.splice(0, maxResults);

  eventsFilter.searchFilter(query);
  let eventSearchResults = eventsFilter.getFilteredArray();
  eventSearchResults = eventSearchResults.splice(0, maxResults);

  return { teams: teamSearchResults, events: eventSearchResults };
};
