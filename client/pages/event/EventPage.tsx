import * as React from "react";
import { IApplicationState } from "shared";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { getEventData, setEventData } from "shared";
import { Typography, Paper } from "@mui/material";

import IconCalendar from "@mui/icons-material/CalendarToday";
import IconLocationPin from "@mui/icons-material/LocationOn";
import IconProviderBadge from "@mui/icons-material/VerifiedUser";
import { DataSource } from "@the-orange-alliance/api/lib/esm/models/types/DataSource";
import EventTabs from "./tabs/EventTabs";

const EventPage = () => {
  const { t } = useTranslation();
  const eventData = useSelector((state: IApplicationState) => state.currentEvent);
  const dispatch = useDispatch();
  const { eventCode, tab } = useParams<{ eventCode: string; tab: string }>();
  React.useEffect(() => {
    getEventData(eventCode).then((event) => {
      console.log(event);
      dispatch(setEventData(event));
    });
  }, []);

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
        <EventTabs key={eventData.eventKey} currentTab={tab} event={eventData} />
      </Paper>
    </>
  );
};

export default EventPage;
