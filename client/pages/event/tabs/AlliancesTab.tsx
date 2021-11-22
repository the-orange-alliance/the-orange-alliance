import * as React from "react";
import { Table, TableCell, TableHead, TableBody, TableRow } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState, setEventMatches, getEventMatches } from "shared";
import { Match, Alliance } from "@the-orange-alliance/api/lib/esm/models";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AlliancesTab = () => {
  const { t } = useTranslation();
  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  function loadEventMatches() {
    getEventMatches(eventCode).then((matches: Match[]) => {
      dispatch(setEventMatches(matches));
    });
  }
  const alliances = useSelector((state: IApplicationState) => state.currentEvent.alliances);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Alliance</TableCell>
          <TableCell>Captain</TableCell>
          <TableCell>Pick 1</TableCell>
          <TableCell>Pick 2</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {alliances.map((alliance: Alliance) => (
          <TableRow key={alliance.seed}>
            <TableCell>Alliance {alliance.seed}</TableCell>
            <TableCell>#{alliance.captain.teamKey}</TableCell>
            <TableCell>#{alliance.pick1.teamKey}</TableCell>
            <TableCell>#{alliance.pick2 ? alliance.pick2.teamKey : ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlliancesTab;
