import { Grid, Stack } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface EightVerticalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const EightVerticalView: React.FC<EightVerticalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      <Grid container size={showChat ? 9 : 12}>
        <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
          <Stack direction="column" sx={{ width: '100%' }}>
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
          </Stack>

          <Stack direction="column" sx={{ width: '100%' }}>
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
          </Stack>
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

export default EightVerticalView;
