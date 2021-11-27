import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface OnePlusSixViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const OnePlusSixView: React.FC<OnePlusSixViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item container xs={showChat ? 9 : 12} direction="column">
        <Grid container item xs={9}>
          <Grid item xs={8}>
            <LiveStreamPanel streams={streams} />
          </Grid>

          <Grid item container xs={4} direction="column" wrap="nowrap">
            <Grid item xs={4}>
              <LiveStreamPanel streams={streams} />
            </Grid>
            <Grid item xs={4}>
              <LiveStreamPanel streams={streams} />
            </Grid>
            <Grid item xs={4}>
              <LiveStreamPanel streams={streams} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={3}>
          <Grid item xs={4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={4}>
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

export default OnePlusSixView;
