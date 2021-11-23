import * as React from 'react';
import { Table, TableCell, TableHead, TableBody, TableRow } from '@mui/material';
import { Alliance, Event } from '@the-orange-alliance/api/lib/cjs/models';

interface IProps {
  event: Event;
}

const AlliancesTab = (props: IProps) => {
  const { alliances } = props.event;

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
            <TableCell>#{alliance.pick2 ? alliance.pick2.teamKey : ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlliancesTab;
