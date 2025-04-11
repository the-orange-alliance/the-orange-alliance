import { Typography } from '@mui/material';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MatchTable from '@/components/ui/match-table';

interface IProps {
  event: Event;
}

const MatchesTab = (props: IProps) => {
  return (
    <>
      <MatchTable event={props.event} allowSelection />
      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
        All times are displayed in your local timezone.
      </Typography>
    </>
  );
};

export default MatchesTab;
