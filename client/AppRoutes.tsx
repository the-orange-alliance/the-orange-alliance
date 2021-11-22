import * as React from "react";
import { RouteProps, Redirect, useParams } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import EventIcon from "@mui/icons-material/Event";
import GavelIcon from "@mui/icons-material/Gavel";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import PublishIcon from "@mui/icons-material/Publish";
import TranslateIcon from "@mui/icons-material/Translate";
import VideoCamIcon from "@mui/icons-material/Videocam";

/* import all of our pages here */
import { AboutPage, HomePage, TeamsPage, EventsPage, EventPage, LanguagePage } from "./pages";
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
    to: "/streaming",
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
    to: "/upload",
    group: 2,
    component: () => <div>Upload data</div>,
    visible: true
  },
  {
    name: "API",
    translationKey: "drawer.api",
    icon: <CodeIcon />,
    to: "/api",
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
    to: "/privacy",
    group: 3,
    component: () => <div>Privacy & Terms!</div>,
    visible: true
  }
];

export default routes;
