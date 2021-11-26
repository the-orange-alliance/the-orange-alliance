import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface HexViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const HexView: React.FC<HexViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item container xs={showChat ? 9 : 12}>
        <Grid item container xs={4}>
          <Grid item xs={12}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={12}>
            <LiveStreamPanel streams={streams} />
          </Grid>
        </Grid>
        <Grid item container xs={4}>
          <Grid item xs={12}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={12}>
            <LiveStreamPanel streams={streams} />
          </Grid>
        </Grid>
        <Grid item container xs={4}>
          <Grid item xs={12}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={12}>
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

export default HexView;
