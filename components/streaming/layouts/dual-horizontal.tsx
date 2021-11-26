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
    <Grid container sx={{ height: '100%' }} columns={24}>
      <Grid item container xs={showChat ? 18 : 24} columns={24} sx={{ height: '100%' }}>
        <Grid item xs={24}>
          <LiveStreamPanel streams={streams} />
        </Grid>
        <Grid item xs={24}>
          <LiveStreamPanel streams={streams} />
        </Grid>
      </Grid>
      {showChat && (
        <Grid item xs={6}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default DualHorizontalView;
