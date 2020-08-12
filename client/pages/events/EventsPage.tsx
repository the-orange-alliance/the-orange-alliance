import * as React from "react";
import Event from "@the-orange-alliance/api/lib/models/Event";
import { IApplicationState, IEventsProps, getEventsData, ISetEvents, ApplicationActions, setEvents } from "shared";
import { Dispatch } from "redux";
import { connect, useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

interface IProps {
  events: Event[];
  setEvents: (events: Event[]) => ISetEvents;
}

const EventsPage = function () {
  const { t } = useTranslation();
  const events = useSelector((state: IApplicationState) => state.events);
  const dispatch = useDispatch();
  React.useEffect(() => {
    getEventsData({ events }).then((props: IEventsProps) => {
      dispatch(setEvents(props.events));
    });
  }, []);

  return <div>{t("pages.events.title")}</div>;
};

export default EventsPage;
