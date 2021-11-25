import * as React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import EventIcon from '@mui/icons-material/Event';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import PublishIcon from '@mui/icons-material/Publish';
import TranslateIcon from '@mui/icons-material/Translate';
import VideoCamIcon from '@mui/icons-material/Videocam';

// import { changeLanguage } from "./i18n";

export interface IAppRoute {
  name: string;
  translationKey?: string;
  to: string;
  group: number;
  icon?: React.ReactElement;
  visible: boolean;
}

const routes: IAppRoute[] = [
  {
    name: 'Home',
    translationKey: 'drawer.home',
    icon: <HomeIcon />,
    to: '/',
    group: 0,
    visible: true
  },
  {
    name: 'Teams',
    translationKey: 'drawer.teams',
    icon: <PeopleIcon />,
    to: '/teams',
    group: 0,
    visible: true
  },
  {
    name: 'Event',
    icon: <EventIcon />,
    to: '/events/:eventCode',
    group: 0,
    visible: false
  },
  {
    name: 'Event',
    icon: <EventIcon />,
    to: '/events/:eventCode/:tab',
    group: 0,
    visible: false
  },
  {
    name: 'Events',
    translationKey: 'drawer.events',
    icon: <EventIcon />,
    to: '/events',
    group: 0,
    visible: true
  },
  {
    name: 'Streaming',
    translationKey: 'drawer.streaming',
    icon: <VideoCamIcon />,
    to: '/streams',
    group: 0,
    visible: true
  },
  {
    name: 'Select Language',
    translationKey: 'drawer.select_language',
    icon: <TranslateIcon />,
    to: '/languages',
    group: 1,
    visible: true
  },
  {
    name: 'Add Data',
    translationKey: 'drawer.add_data',
    icon: <PublishIcon />,
    to: '/upload',
    group: 2,
    visible: true
  },
  {
    name: 'API',
    translationKey: 'drawer.api',
    icon: <CodeIcon />,
    to: '/api',
    group: 2,
    visible: true
  },
  {
    name: 'About',
    translationKey: 'drawer.about',
    icon: <InfoIcon />,
    to: '/about',
    group: 3,
    visible: true
  },
  {
    name: 'Privacy & Terms',
    translationKey: 'drawer.privacy_and_terms',
    icon: <GavelIcon />,
    to: '/privacy',
    group: 3,
    visible: true
  }
];

export default routes;
