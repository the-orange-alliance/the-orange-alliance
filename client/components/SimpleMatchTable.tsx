import * as React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class SimpleMatchTable extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={'simple-match-table'}>
            <TableHead className={'grey-bg'}>
              {/* TODO - Logic for 2-3 teams */}
              <TableCell align="center" colSpan={2}>
                Teams
              </TableCell>
              <TableCell align="center" colSpan={1}>
                Score
              </TableCell>
            </TableHead>
            <TableBody>
              <TableRow className={'red-bg'}>
                <TableCell align="center">
                  <Button fullWidth>3618</Button>
                </TableCell>
                <TableCell align="center">
                  <Button fullWidth>4003</Button>
                </TableCell>
                <TableCell align="center">
                  <Button fullWidth>12</Button>
                </TableCell>
              </TableRow>
              <TableRow className={'blue-bg'}>
                <TableCell align="center">
                  <Button fullWidth>3618</Button>
                </TableCell>
                <TableCell align="center">
                  <Button fullWidth>4003</Button>
                </TableCell>
                <TableCell align="center">
                  <Button fullWidth>12</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default SimpleMatchTable;
