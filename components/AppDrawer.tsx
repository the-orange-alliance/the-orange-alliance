import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslate } from '../i18n/i18n';
import routes, { IAppRoute } from '../constants/routes';
import NextMuiLink from './NextMuiLink';
import ListItemLink from './ListItemLink';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mui/material';

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    flexShrink: 0
  },
  drawerContainer: {
    overflow: 'auto'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
    // [theme.breakpoints.up('sm')]: {
    //   // width: `calc(100% - ${drawerWidth}px)`, // This makes a 'clipped' drawer
    //   marginLeft: drawerWidth,
    // },
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  toolbarImage: {
    padding: theme.spacing(1)
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: '#f5f6f7',
    minHeight: '100vh'
  },
  streams: {
    background: '#000 !important',
    paddingLeft: '0 !important',
    paddingRight: '0 !important'
  }
}));

interface ResponsiveDrawerProps {
  title: string;
  container?: any;
  content?: React.ReactElement;
}

const AppDrawer = (props: ResponsiveDrawerProps) => {
  const { title, container, content } = props;
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const menuButtonSx =
    router.route === '/streams' ? { display: 'block' } : { display: { sm: 'block', md: 'none' } };

  const drawerSx =
    router.route === '/streams' ? { width: 0 } : { width: { sm: 0, md: drawerWidth } };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (largeScreen && !mobileOpen && router.route !== '/streams') {
      setMobileOpen(true);
    } else if (!largeScreen && mobileOpen) {
      setMobileOpen(false);
    }
  }, [largeScreen]);

  const routeGroups: Map<number, IAppRoute[]> = new Map();
  for (const route of routes) {
    if (typeof routeGroups.get(route.group) === 'undefined') {
      routeGroups.set(route.group, []);
    }
    if (route.visible) {
      (routeGroups.get(route.group) as IAppRoute[]).push(route);
    }
  }

  let routesView: React.ReactElement[] = [];
  routeGroups.forEach((value: IAppRoute[], key: number) => {
    const groupView = value.map((route: IAppRoute) => {
      return (
        <ListItemLink
          key={`nav-route-${route.name.toLowerCase()}`}
          href={route.to}
          icon={route.icon}
          primary={route.translationKey ? t(route.translationKey) : route.name}
          onClick={handleDrawerToggle}
        />
      );
    });
    routesView.push(<Divider key={`div-${key}`} />);
    routesView.push(<List key={key}>{groupView}</List>);
  });
  const drawer = (
    <div className={classes.drawerContainer}>
      <div className={classes.toolbar}>
        <NextMuiLink href={'/'}>
          <img src={''} className={`${classes.toolbarImage} fit-w`} alt={''} />
        </NextMuiLink>
      </div>
      {routesView}
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar elevation={0} position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={menuButtonSx}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="application links">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant={largeScreen && router.route !== '/streams' ? 'permanent' : 'temporary'}
          open={mobileOpen}
          onClose={() => !largeScreen && handleDrawerToggle()}
          sx={drawerSx}
          hideBackdrop
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </nav>
      <main className={classes.content + ` ${router.route === '/streams' ? classes.streams : ''}`}>
        <div className={classes.toolbar} />
        {content}
      </main>
    </div>
  );
};

export default AppDrawer;
