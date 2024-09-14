import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface DualVerticalViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const DualVerticalView: React.FC<DualVerticalViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }} columns={24}>
      <Grid item xs={showChat ? 9 : 6}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      <Grid item xs={showChat ? 9 : 6}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      {showChat && (
        <Grid item xs={6}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default DualVerticalView;
