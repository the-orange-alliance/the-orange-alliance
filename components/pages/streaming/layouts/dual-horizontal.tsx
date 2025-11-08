import { Grid, Stack } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface DualHorizontalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const DualHorizontalView: React.FC<DualHorizontalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      <Grid size={showChat ? 9 : 12}>
        <Stack direction="column" sx={{ height: '100%', width: '100%' }}>
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

export default DualHorizontalView;
