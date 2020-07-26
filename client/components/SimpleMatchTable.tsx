import * as React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Match from '@the-orange-alliance/api/lib/models/Match';
import MatchParticipant from '@the-orange-alliance/api/lib/models/MatchParticipant';
import MatchStations from '@the-orange-alliance/api/lib/models/types/MatchStations';

interface IProps {
  match: Match;
}

class SimpleMatchTable extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const { match } = this.props;
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={'simple-match-table'}>
            <TableHead className={'grey-bg'}>
              <TableCell
                align="center"
                colSpan={match.participants.length > 4 ? 3 : 2}
              >
                Teams
              </TableCell>
              <TableCell align="center" colSpan={1}>
                Score
              </TableCell>
            </TableHead>
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
        <TableCell key={p.matchParticipantKey} align="center">
          <Button fullWidth>{p.teamKey}</Button>
        </TableCell>
      );
    });
    console.log(redAlliance);
    return (
      <TableRow className={'red-bg'}>
        {redView}
        <TableCell>
          <Button fullWidth>{match.redScore}</Button>
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
        <TableCell key={p.matchParticipantKey} align="center">
          <Button fullWidth>{p.teamKey}</Button>
        </TableCell>
      );
    });
    return (
      <TableRow className={'blue-bg'}>
        {blueView}
        <TableCell>
          <Button fullWidth>{match.blueScore}</Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default SimpleMatchTable;
