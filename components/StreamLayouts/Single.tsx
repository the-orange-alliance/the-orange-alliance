import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { Grid } from '@mui/material';
import LiveStreamPanel from '../LiveStreamPanel';

const SingleView = ({ streams, showChat }: { streams: EventLiveStream[]; showChat: boolean }) => {
  return (
    <Grid className={'m-0 h-100'} style={{ width: '100vw' }} container direction={'row'}>
      <Grid item xs={showChat ? 9 : 12}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      {showChat && (
        <Grid item xs={3} className="h-100 w-100">
          <iframe
            className={'h-100 w-100'}
            frameBorder="0"
            scrolling="no"
            src="https://www.twitch.tv/embed/theorangealliance/chat?darkpopout&parent=theorangealliance.org&parent=localhost"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SingleView;
