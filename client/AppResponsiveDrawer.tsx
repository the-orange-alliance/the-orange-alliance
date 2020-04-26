import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {Link as RouterLink} from 'react-router-dom';
import {IAppRoute} from "./AppRoutes";
import ListItemLink from './components/ListItemLink';

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    toolbarImage: {
      padding: theme.spacing(1)
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

interface ResponsiveDrawerProps {
  title: string;
  routes: IAppRoute[];
  container?: any;
  content?: React.ReactElement;
}

export default function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const { title, container, content, routes } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const routeGroups: Map<number, IAppRoute[]> = new Map();
  for (const route of routes) {
    if (typeof routeGroups.get(route.group) === "undefined") {
      routeGroups.set(route.group, []);
    }
    if (route.visible) {
      (routeGroups.get(route.group) as IAppRoute[]).push(route);
    }
  }
  let routesView: React.ReactElement[] = [];
  routeGroups.forEach(((value: IAppRoute[], key: number) => {
    const groupView = value.map((route: IAppRoute) => {
      return (
        <ListItemLink
          key={`nav-route-${route.name.toLowerCase()}`}
          to={route.to}
          primary={route.name}
          icon={route.icon}
          onClick={mobileOpen ? handleDrawerToggle : undefined}
        />
      );
    });
    routesView.push(<Divider key={`div-${key}`}/>);
    routesView.push(
      <List key={key}>
        {groupView}
      </List>
    )
  }));
  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <RouterLink to={"/"}>
          <img src={''} className={`${classes.toolbarImage} fit-w`} alt={""}/>
        </RouterLink>
      </div>
      {routesView}
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
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
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
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
}