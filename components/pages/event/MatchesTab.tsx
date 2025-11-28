import { Stack, Typography } from '@mui/material';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MatchTable from '@/components/ui/match-table';
import { useTranslate } from '@/i18n/i18n';

interface IProps {
  event: Event;
}

const MatchesTab = (props: IProps) => {
  const t = useTranslate();

  return (
    <>
      <MatchTable event={props.event} allowSelection />
      <Stack sx={{ p: 4 }}>
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: t('match_table.help.team_status') }}
        />
        <Typography variant="body2" color="text.secondary">
          All times are displayed in your local timezone.
        </Typography>
      </Stack>
    </>
  );
};

export default MatchesTab;
