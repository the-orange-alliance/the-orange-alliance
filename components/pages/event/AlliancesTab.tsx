import NextLink from 'next/link';
import { Table, TableCell, TableHead, TableBody, TableRow, Link } from '@mui/material';
import { Alliance, Event } from '@the-orange-alliance/api/lib/cjs/models';

interface IProps {
  event: Event;
}

const AlliancesTab = (props: IProps) => {
  const { alliances } = props.event;
  const hasPick2 = alliances.some((alliance: Alliance) => alliance.pick2);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Seed</TableCell>
          <TableCell>Captain</TableCell>
          <TableCell>Pick 1</TableCell>
          {hasPick2 && <TableCell>Pick 2</TableCell>}{' '}
        </TableRow>
      </TableHead>
      <TableBody>
        {alliances.map((alliance: Alliance) => (
          <TableRow key={alliance.seed}>
            <TableCell style={{ whiteSpace: 'nowrap' }}>Alliance {alliance.seed}</TableCell>
            <TableCell>
              <NextLink href={`/teams/${alliance.captain.teamKey}`} passHref legacyBehavior>
                <Link underline="hover">
                  #{alliance.captain.teamKey} {alliance.captain.teamNameShort}
                </Link>
              </NextLink>
            </TableCell>
            <TableCell>
              <NextLink href={`/teams/${alliance.pick1.teamKey}`} passHref legacyBehavior>
                <Link underline="hover">
                  #{alliance.pick1.teamKey} {alliance.pick1.teamNameShort}
                </Link>
              </NextLink>
            </TableCell>
            {hasPick2 && (
              <TableCell>
                <NextLink href={`/teams/${alliance.pick2!.teamKey}`} passHref legacyBehavior>
                  <Link underline="hover">
                    #{alliance.pick2!.teamKey} {alliance.pick2!.teamNameShort}
                  </Link>
                </NextLink>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlliancesTab;
