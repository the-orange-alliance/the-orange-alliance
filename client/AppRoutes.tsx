import * as React from 'react';
import {RouteProps} from 'react-router-dom';
import CodeIcon from '@material-ui/icons/Code';
import EventIcon from '@material-ui/icons/Event';
import GavelIcon from '@material-ui/icons/Gavel';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import PublishIcon from '@material-ui/icons/Publish';
import TranslateIcon from '@material-ui/icons/Translate';
import VideoCamIcon from '@material-ui/icons/Videocam';

/* import all of our pages here */
import {HomePage} from "./pages";

export interface IAppRoute {
  name: string;
  to: string;
  group: number;
  component: (routeProps: RouteProps) => React.ReactElement;
  icon?: React.ReactElement;
  visible: boolean;
}

const routes: IAppRoute[] = [
  {
    name: 'Home',
    icon: <HomeIcon/>,
    to: '/',
    group: 0,
    component: () => <HomePage/>,
    visible: true
  },
  {
    name: 'Teams',
    icon: <PeopleIcon/>,
    to: '/teams',
    group: 0,
    component: () => <div>Teams!</div>,
    visible: true
  },
  {
    name: 'Events',
    icon: <EventIcon/>,
    to: '/events',
    group: 0,
    component: () => <div>Events!</div>,
    visible: true
  },
  {
    name: 'Streaming',
    icon: <VideoCamIcon/>,
    to: '/streaming',
    group: 0,
    component: () => <div>Streaming!</div>,
    visible: true
  },
  {
    name: 'Select Language',
    icon: <TranslateIcon/>,
    to: '/languages',
    group: 1,
    component: () => <div>Languages!</div>,
    visible: true
  },
  {
    name: 'Add Data',
    icon: <PublishIcon/>,
    to: '/upload',
    group: 2,
    component: () => <div>Upload data</div>,
    visible: true
  },
  {
    name: 'API',
    icon: <CodeIcon/>,
    to: '/api',
    group: 2,
    component: () => <div>Application Programming Interface!</div>,
    visible: true
  },
  {
    name: 'About',
    icon: <InfoIcon/>,
    to: '/about',
    group: 3,
    component: () => <div>About!</div>,
    visible: true
  },
  {
    name: 'Privacy & Terms',
    icon: <GavelIcon/>,
    to: '/privacy',
    group: 3,
    component: () => <div>Privacy & Terms!</div>,
    visible: true
  }
];

export default routes;