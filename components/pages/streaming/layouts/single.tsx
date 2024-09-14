import { Grid } from '@mui/material';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import LiveStreamPanel from '../panel';
import StreamingChat from '../chat';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface SingleViewProps {
  streams: EventLiveStream[];
  showChat: boolean;
}

const SingleView: React.FC<SingleViewProps> = ({ streams, showChat }) => {
  return (
    <Grid container sx={{ height: '100%' }} columns={24}>
      <Grid item xs={showChat ? 18 : 24}>
        <LiveStreamPanel streams={streams} readFromQuery />
      </Grid>
      {showChat && (
        <Grid item xs={6}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default SingleView;
