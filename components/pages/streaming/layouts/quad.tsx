import { Grid2 as Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface QuadViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const QuadView: React.FC<QuadViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      <Grid container size={showChat ? 9 : 12}>
        <Grid size={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
        <Grid size={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
        <Grid size={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
        <Grid size={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
      </Grid>
      {showChat && (
        <Grid size={3}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default QuadView;
