import * as React from "react";
import { RouteProps, Redirect, useParams } from "react-router-dom";
import CodeIcon from "@material-ui/icons/Code";
import EventIcon from "@material-ui/icons/Event";
import GavelIcon from "@material-ui/icons/Gavel";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import PeopleIcon from "@material-ui/icons/People";
import PublishIcon from "@material-ui/icons/Publish";
import TranslateIcon from "@material-ui/icons/Translate";
import VideoCamIcon from "@material-ui/icons/Videocam";

/* import all of our pages here */
import { AboutPage, HomePage, TeamsPage, EventsPage, EventPage, LanguagePage } from "./pages";
import { Button } from "@material-ui/core";
import { changeLanguage } from "./i18n";

export interface IAppRoute {
  name: string;
  translationKey?: string;
  to: string;
  group: number;
  component: (routeProps: RouteProps) => React.ReactElement;
  icon?: React.ReactElement;
  visible: boolean;
}

const routes: IAppRoute[] = [
  {
    name: "Home",
    translationKey: "drawer.home",
    icon: <HomeIcon />,
    to: "/",
    group: 0,
    component: () => <HomePage />,
    visible: true
  },
  {
    name: "Teams",
    translationKey: "drawer.teams",
    icon: <PeopleIcon />,
    to: "/teams",
    group: 0,
    component: () => <TeamsPage />,
    visible: true
  },
  {
    name: "Event",
    icon: <EventIcon />,
    to: "/events/:eventCode",
    group: 0,
    component: () => {
      // Redirect to /events/eventCode/rankings
      const { eventCode } = useParams<{ eventCode: string }>();
      return <Redirect to={`/events/${eventCode}/rankings`} />;
    },
    visible: false
  },
  {
    name: "Event",
    icon: <EventIcon />,
    to: "/events/:eventCode/:tab",
    group: 0,
    component: () => <EventPage />,
    visible: false
  },
  {
    name: "Events",
    translationKey: "drawer.events",
    icon: <EventIcon />,
    to: "/events",
    group: 0,
    component: () => <EventsPage />,
    visible: true
  },
  {
    name: "Streaming",
    translationKey: "drawer.streaming",
    icon: <VideoCamIcon />,
    to: "/stream",
    group: 0,
    component: () => <div>Streaming!</div>,
    visible: true
  },
  {
    name: "Select Language",
    translationKey: "drawer.select_language",
    icon: <TranslateIcon />,
    to: "/languages",
    group: 1,
    component: () => <LanguagePage />,
    visible: true
  },
  {
    name: "Add Data",
    translationKey: "drawer.add_data",
    icon: <PublishIcon />,
    to: "/add-data",
    group: 2,
    component: () => <div>Upload data</div>,
    visible: true
  },
  {
    name: "API",
    translationKey: "drawer.api",
    icon: <CodeIcon />,
    to: "/apidocs",
    group: 2,
    component: () => <div>Application Programming Interface!</div>,
    visible: true
  },
  {
    name: "About",
    translationKey: "drawer.about",
    icon: <InfoIcon />,
    to: "/about",
    group: 3,
    component: () => <AboutPage />,
    visible: true
  },
  {
    name: "Privacy & Terms",
    translationKey: "drawer.privacy_and_terms",
    icon: <GavelIcon />,
    to: "/privacy-terms",
    group: 3,
    component: () => <div>Privacy & Terms!</div>,
    visible: true
  }
];

export default routes;
