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
    <Grid container sx={{ height: '100%', width: '100%' }} columns={24}>
      <Grid size={showChat ? 18 : 24}>
        <LiveStreamPanel streams={streams} readFromQuery />
      </Grid>
      {showChat && (
        <Grid size={6}>
          <StreamingChat />
        </Grid>
      )}
    </Grid>
  );
};

export default SingleView;
