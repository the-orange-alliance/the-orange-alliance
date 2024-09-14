import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface OnePlusTwoViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const OnePlusTwoView: React.FC<OnePlusTwoViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item xs={showChat ? 6 : 8}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      <Grid item container xs={showChat ? 3 : 4} direction="column">
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

export default OnePlusTwoView;
