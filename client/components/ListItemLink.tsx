import React from "react";
import {Link as RouterLink, LinkProps as RouterLinkProps} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Omit } from '@material-ui/types';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
  onClick?: () => void;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}