import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface DualHorizontalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const DualHorizontalView: React.FC<DualHorizontalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item container xs={showChat ? 9 : 12} direction="column">
        <Grid item xs={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
        <Grid item xs={6}>
          <LiveStreamPanel streams={streams} />
        </Grid>
      </Grid>
      {showChat && (
        <Grid item xs={3}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default DualHorizontalView;
