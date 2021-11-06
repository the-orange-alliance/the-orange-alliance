import * as React from "react";
import { List, ListItem, ListItemText, ListItemAvatar, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState, setEventMatches, getEventMatches } from "shared";
import { Match, EventParticipant } from "@the-orange-alliance/api/lib/esm/models";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const TeamsTab = function () {
  const { t } = useTranslation();
  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  function loadEventMatches() {
    getEventMatches(eventCode).then((matches: Match[]) => {
      dispatch(setEventMatches(matches));
    });
  }
  const teams = useSelector((state: IApplicationState) => state.currentEvent.teams);

  return (
    <List>
      {teams.map((team: EventParticipant) => (
        <ListItem component='a' button href={`/teams/${team.teamKey}`}>
          <ListItemAvatar>
            <Button disabled>{team.teamKey}</Button>
          </ListItemAvatar>
          <ListItemText
            primary={team.team.teamNameShort}
            secondary={`${team.team.city}, ${team.team.stateProv}, ${team.team.country}`}
          ></ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default TeamsTab;
