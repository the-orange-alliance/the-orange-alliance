import { Grid, Stack } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface EightHorizontalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const EightHorizontalView: React.FC<EightHorizontalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      <Grid container direction="column" size={showChat ? 9 : 12}>
        <Stack direction="row" sx={{ height: '50%', width: '100%' }}>
          <LiveStreamPanel streams={streams} />
          <LiveStreamPanel streams={streams} />
          <LiveStreamPanel streams={streams} />
          <LiveStreamPanel streams={streams} />
        </Stack>

        <Stack direction="row" sx={{ height: '50%', width: '100%' }}>
          <LiveStreamPanel streams={streams} />
          <LiveStreamPanel streams={streams} />
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

export default EightHorizontalView;
