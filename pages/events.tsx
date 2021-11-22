import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { SyntheticEvent, useState } from "react";
import {Region, Season, Week, Event} from "@the-orange-alliance/api/lib/cjs/models";
import SimpleEventPaper from "../components/SimpleEventPaper";
import {EventFilter, EventSorter} from "../util/event-utils";
import {GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage} from "next";
import {getEventsData, IRawEventsProps, parseEventsProps} from "../lib/PageHelpers/eventsHelper";
import TOAProvider from "../providers/TOAProvider";
import {useTranslate} from "../i18n/i18n";
import NextMuiLink from "../components/NextMuiLink";

const useStyles = makeStyles((theme: Theme) =>
  ({
    filterSelect: {
      width: "30px"
    }
  })
);


interface AutoComplete<T> {
  label: string;
  parent: T;
}

const EventsPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const t = useTranslate();
  const {events, regions, seasons} = parseEventsProps(props as IRawEventsProps);

  const [localRegions, setLocalRegions] = useState<AutoComplete<Region>[]>([]);
  const [localSeasons, setLocalSeasons] = useState<AutoComplete<Season>[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<AutoComplete<Region>>();
  const [selectedSeason, setSelectedSeason] = useState<AutoComplete<Season>>();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [currentWeekTab, setCurrentWeekTab] = useState<string>("");
  const [availableWeeks, setAvailableWeeks] = useState<Week[]>([]);

  React.useEffect(() => {
    // Add "All Regions"
    const regionCopy = [...regions];
    const newRegion = new Region();
    newRegion.regionKey = "all";
    newRegion.description = "All Regions";
    regionCopy.splice(0, 0, newRegion);
    setLocalRegions(
      regionCopy.map((r: Region) => {
        return { label: getRegionString(r), parent: r };
      })
    );
    setSelectedRegion({ label: regionCopy[0].description, parent: regionCopy[0] });

    seasons.sort((a: Season, b: Season) => parseInt(b.seasonKey) - parseInt(a.seasonKey));
    setLocalSeasons(
      seasons.map((s: Season) => {
        return { label: getSeasonString(s), parent: s };
      })
    );
    setSelectedSeason({ label: getSeasonString(seasons[0]), parent: seasons[0] });
    selectSeason(seasons[0], events)
  }, []);

  function getSeasonString(season: Season) {
    const codeOne = season.seasonKey.toString().substring(0, 2);
    const codeTwo = season.seasonKey.toString().substring(2, 4);
    return "20" + codeOne + "/" + codeTwo + " - " + season.description;
  }

  function getRegionString(region: Region) {
    if (region.regionKey === "all") return region.description;
    return `${region.regionKey.toUpperCase()} - ${region.description}`;
  }

  function onSelectSeason(event: any, val: AutoComplete<Season> | null) {
    if (!val) val = localSeasons[0];
    setSelectedSeason(val);
    selectSeason(val.parent);
  }

  function onSelectRegion(event: any, val: AutoComplete<Region> | null) {
    if (!val) val = localRegions[0];
    setSelectedRegion(val);
    selectRegion(val.parent);
  }

  function selectRegion(region: Region, newEvents?: Event[]) {
    let filtered: Event[] = [];
    if (!newEvents) newEvents = events;
    if (region && region.regionKey !== "all") {
      const ef = new EventFilter(newEvents);
      ef.filterArray(region.regionKey);
      filtered = ef.getFilteredArray();
    } else {
      filtered = newEvents;
    }
    setFilteredEvents(new EventSorter().sort(filtered));
    organizeEventsByWeek(filtered);
  }

  async function selectSeason(season: Season, newEvents?: Event[]) {
    if(!newEvents || newEvents.length < 1 || (newEvents.length > 0 && newEvents[0].seasonKey !== season.seasonKey)) {
      try {
        setFilteredEvents([]);
        newEvents = await TOAProvider.getAPI().getEvents({season_key: season.seasonKey});
      } catch (error) {
        newEvents = [];
      }
    }
    selectRegion(selectedRegion?.parent || new Region().fromJSON({ region_key: "all" }), newEvents);
  }

  function organizeEventsByWeek(newEvents: Event[]) {
    const tempWeek = {} as { [key: string]: Week };
    for (const event of newEvents) {
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
    const aWeeks = Object.values(tempWeek);
    setAvailableWeeks(aWeeks);
    setCurrentWeekTab(aWeeks[0] ? aWeeks[0].weekKey : "");
  }

  function selectTab(e: SyntheticEvent, val: string) {
    setCurrentWeekTab(val);
  }

  function clearFilters() {
    setSelectedRegion(localRegions[0]);
    setSelectedSeason(localSeasons[0]);
  }

  function getWeekName(week: string) {
    switch (week) {
      case "CMP":
        return "FIRST Championship";
      case "CMPHOU":
        return "FIRST Championship - Houston";
      case "CMPSTL":
        return "FIRST Championship - St. Louis";
      case "CMPDET":
        return "FIRST Championship - Detroit";
      case "ESR":
        return "East Super Regional Championship";
      case "NSR":
        return "North Super Regional Championship";
      case "SSR":
        return "South Super Regional Championship";
      case "WSR":
        return "West Super Regional Championship";
      case "SPR":
        return "Super Regionals";
      case "FOC":
        return "Festival of Champions";
      default:
        if (week.match("-?\\d+(\\.\\d+)?")) {
          // match a number with optional '-' and decimal.
          return "Week " + week;
        } else {
          return week;
        }
    }
  }

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        {t("general.events")}
      </Typography>

      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            {t("pages.events.filter")}
          </Typography>
          <Divider />
          <Grid container>
            <Grid item xs={4} p={2}>
              <Autocomplete
                key={selectedSeason?.label}
                disablePortal
                id='seasons-filter'
                options={localSeasons}
                value={selectedSeason}
                isOptionEqualToValue={(a, b) => a.parent.seasonKey === b.parent.seasonKey}
                defaultValue={selectedSeason}
                onChange={onSelectSeason}
                renderInput={(params) => (
                  <TextField {...params} variant={"standard"} label={t("pages.events.filter_season")} />
                )}
              />
            </Grid>
            <Grid item xs={4} p={2}>
              <Autocomplete
                key={selectedRegion?.label}
                disablePortal
                id='regions-filter'
                options={localRegions}
                value={selectedRegion}
                isOptionEqualToValue={(a, b) => a.parent.regionKey === b.parent.regionKey}
                defaultValue={selectedRegion}
                onChange={onSelectRegion}
                renderInput={(params) => (
                  <TextField {...params} variant={"standard"} label={t("pages.events.filter_region")} />
                )}
              />
            </Grid>
          </Grid>
          <Divider />
          <Button fullWidth onClick={clearFilters}>
            {t("pages.events.clear_filter")}
          </Button>
        </CardContent>
      </Card>

      <Card className={"mt-5"}>
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={currentWeekTab} onChange={selectTab} variant={"fullWidth"}>
                {availableWeeks.map((week: Week) => (
                  <Tab key={week.weekKey} label={getWeekName(week.weekKey)} value={week.weekKey} />
                ))}
              </Tabs>
            </Box>
            {filteredEvents.map((event) => {
              if (event.weekKey === currentWeekTab) {
                return <SimpleEventPaper key={event.eventKey} event={event} />;
              }
            })}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return {props: await getEventsData()}
}

export default EventsPage;
