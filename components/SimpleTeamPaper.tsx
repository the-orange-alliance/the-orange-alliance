import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { Team } from "@the-orange-alliance/api/lib/cjs/models";
import Link from 'next/link';

interface IProps {
  team: Team;
}

const SimpleTeamPaper = (props: IProps) => {
  const { team } = props;

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const primaryText =
    team.teamNameShort && team.teamNameShort.length > 0 ? team.teamNameShort : `Team #${team.teamKey}`;
  const city = capitalizeFirstLetter(team.city ? `${team.city}, ` : "");
  const stateProv = (team.stateProv ? `${team.stateProv}, ` : "").toUpperCase();
  const country = (team.country ? `${team.country}` : "").toUpperCase();
  const secondaryText = city + stateProv + country;

  return (
    <Link href={`/teams/${team.teamKey}`}>
      <ListItem button>
        <ListItemAvatar>
          <>{team.teamKey}</>
        </ListItemAvatar>
        <ListItemText primary={primaryText} secondary={secondaryText} />
      </ListItem>
    </Link>
  );
};

export default SimpleTeamPaper;
