import React from 'react';
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

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth
    },
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
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
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
  const t = useTranslate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          onClick={mobileOpen ? handleDrawerToggle : undefined}
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
      <CssBaseline />
      <AppBar elevation={0} position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="application inks">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <Toolbar />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {content}
      </main>
    </div>
  );
};

export default AppDrawer;
