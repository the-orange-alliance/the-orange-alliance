import { Grid, Stack } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';

interface OnePlusSixViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const OnePlusSixView: React.FC<OnePlusSixViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%', width: '100%' }}>
      {/* Stream Container */}
      <Grid size={showChat ? 9 : 12}>
        <Stack direction="column" sx={{ height: '100%' }}>
          <Grid container sx={{ height: '70%', width: '100%' }}>
            {/* Big boy up top */}
            <Grid size={8}>
              <LiveStreamPanel streams={streams} />
            </Grid>

            <Grid wrap="nowrap" size={4}>
              <Stack direction="column" sx={{ height: '100%', width: '100%' }}>
                <LiveStreamPanel streams={streams} />
                <LiveStreamPanel streams={streams} />
                <LiveStreamPanel streams={streams} />
              </Stack>
            </Grid>
          </Grid>

          <Stack direction="row" sx={{ height: '30%', width: '100%' }}>
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
            <LiveStreamPanel streams={streams} />
          </Stack>
        </Stack>
      </Grid>

      {/* Chat Container */}
      {showChat && (
        <Grid size={3}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default OnePlusSixView;
