import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface EightHorizontalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const EightHorizontalView: React.FC<EightHorizontalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item container xs={showChat ? 9 : 12} direction="column">
        <Grid item container xs={6}>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={3}>
            <LiveStreamPanel streams={streams} />
          </Grid>
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

export default EightHorizontalView;
