import React from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme, Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Link as RouterLink } from "react-router-dom";
import { IAppRoute } from "./AppRoutes";
import ListItemLink from "./components/ListItemLink";
import { useTranslation } from "react-i18next";

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth
      },
      flexShrink: 0
    },
    drawerContainer: {
      overflow: "auto"
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
      [theme.breakpoints.up("md")]: {
        display: "none"
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
      padding: theme.spacing(2),
      background: "#f5f6f7",
      height: "100vh"
    }
  })
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
  const { t } = useTranslation();
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
  routeGroups.forEach((value: IAppRoute[], key: number) => {
    const groupView = value.map((route: IAppRoute) => {
      return (
        <ListItemLink
          key={`nav-route-${route.name.toLowerCase()}`}
          to={route.to}
          primary={route.translationKey ? t(route.translationKey) : route.name}
          icon={route.icon}
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
        <RouterLink to={"/"}>
          <img src={""} className={`${classes.toolbarImage} fit-w`} alt={""} />
        </RouterLink>
      </div>
      {routesView}
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar elevation={0} position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            size='large'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='application inks'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === "rtl" ? "right" : "left"}
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
        <Hidden mdDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant='permanent'
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
}
