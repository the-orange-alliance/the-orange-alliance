import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NextMuiLink from './NextMuiLink';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  href: string;
  onClick?: () => void;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, href, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      React.forwardRef<any, any>((itemProps, ref) => (
        <NextMuiLink href={href} ref={ref} {...itemProps} />
      )),
    [href]
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
