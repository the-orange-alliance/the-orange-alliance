import * as React from "react";
import Event from "@the-orange-alliance/api/lib/models/Event";
import { IApplicationState, IEventsProps, getEventsData, ISetEvents, ApplicationActions, setEvents } from "shared";
import { Dispatch } from "redux";
import { connect, useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";
import { getEventData, setEventData } from "shared";
import { Typography, Paper, Fade } from "@material-ui/core";

import IconCalendar from "@material-ui/icons/CalendarToday";
import IconLocationPin from "@material-ui/icons/LocationOn";
import IconProviderBadge from "@material-ui/icons/VerifiedUser";
import { DataSource } from "@the-orange-alliance/api/lib/models/types/DataSource";
import EventTabs from "./tabs/EventTabs";

const EventPage = function () {
  const { t } = useTranslation();
  const eventData = useSelector((state: IApplicationState) => state.currentEvent);
  const dispatch = useDispatch();
  const { eventCode, tab } = useParams<{ eventCode: string; tab: string }>();
  const history = useHistory();
  React.useEffect(() => {
    getEventData(eventCode).then((event) => {
      console.log(event);
      dispatch(setEventData(event));
    });
  }, []);

  function setCurrentTab(tab: string) {
    console.log(tab);
    history.replace(`/events/${eventCode}/${tab}`);
  }

  function strToDate(dateString: string) {
    return new Date(Date.parse(dateString));
  }

  const startDate = strToDate(eventData.startDate);

  return (
    <>
      <Typography variant='h4'>
        {startDate.getFullYear()} {eventData.fullEventName}
      </Typography>
      <Typography>
        <IconCalendar fontSize='small' />
        {t("month." + startDate.getMonth())} {startDate.getDay()}, {startDate.getFullYear()}
      </Typography>
      <Typography>
        <IconLocationPin fontSize='small' />
        <a href={`https://www.google.com/maps/search/?api=1&query=${eventData.venue}`} target='_blank'>
          {eventData.venue}
        </a>
        , {eventData.city}, {eventData.stateProv}, {eventData.country}
      </Typography>
      <Typography>
        <IconProviderBadge fontSize='small' />
        {eventData.dataSource === DataSource.DataSync
          ? t("pages.event.data_source.data_sync")
          : eventData.dataSource === DataSource.EventArchive
          ? t("pages.event.data_source.affiliate")
          : eventData.dataSource === DataSource.FIRST
          ? t("pages.event.data_source.first")
          : ""}
      </Typography>
      <Paper
        style={{
          marginTop: "16px"
        }}
      >
        <EventTabs currentTab={tab} handleTabChange={setCurrentTab}></EventTabs>
      </Paper>
    </>
  );
};

export default EventPage;
