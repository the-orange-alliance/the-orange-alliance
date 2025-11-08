import { Grid, Stack } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface OnePlusTwoViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const OnePlusTwoView: React.FC<OnePlusTwoViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      <Grid size={showChat ? 6 : 8}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      <Grid size={showChat ? 3 : 4}>
        <Stack sx={{ height: '100%', width: '100%' }} direction="column">
          <LiveStreamPanel streams={streams} />
          <LiveStreamPanel streams={streams} />
        </Stack>
      </Grid>
      {showChat && (
        <Grid size={3}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default OnePlusTwoView;
