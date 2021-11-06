import * as React from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Match from "@the-orange-alliance/api/lib/esm/models/Match";
import MatchParticipant from "@the-orange-alliance/api/lib/esm/models/MatchParticipant";
import MatchStations from "@the-orange-alliance/api/lib/esm/models/types/MatchStations";

interface IProps {
  match: Match;
  header?: boolean;
}

class SimpleMatchTable extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { match, header = true } = this.props;
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={"simple-match-table"}>
            {header ? (
              <TableHead className={"grey-bg"}>
                <TableCell align='center' colSpan={match.participants.length > 4 ? 3 : 2}>
                  Teams
                </TableCell>
                <TableCell align='center' colSpan={1}>
                  Score
                </TableCell>
              </TableHead>
            ) : null}
            <TableBody>
              {this.renderRedAlliance(match)}
              {this.renderBlueAlliance(match)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  private renderRedAlliance(match: Match) {
    const { participants } = match;
    const redAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station < MatchStations.Blue1
    );
    const redView = redAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align='center'>
          <Button fullWidth color={"secondary"}>
            {p.teamKey}
          </Button>
        </TableCell>
      );
    });
    return (
      <TableRow className={"red-bg"}>
        {redView}
        <TableCell>
          <Button fullWidth color={"secondary"}>
            {match.redScore}
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  private renderBlueAlliance(match: Match) {
    const { participants } = match;
    const blueAlliance: MatchParticipant[] = participants.filter(
      (p: MatchParticipant) => p.station >= MatchStations.Blue1
    );
    const blueView = blueAlliance.map((p: MatchParticipant) => {
      return (
        <TableCell key={p.matchParticipantKey} align='center'>
          <Button fullWidth color={"secondary"}>
            {p.teamKey}
          </Button>
        </TableCell>
      );
    });
    return (
      <TableRow className={"blue-bg"}>
        {blueView}
        <TableCell>
          <Button fullWidth color={"secondary"}>
            {match.blueScore}
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default SimpleMatchTable;
