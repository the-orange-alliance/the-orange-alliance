import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { Grid } from '@mui/material';
import LiveStreamPanel from '../LiveStreamPanel';

const OnePlusThree = ({ streams, showChat }: { streams: EventLiveStream[]; showChat: boolean }) => {
  return (
    <Grid className={'m-0 h-100'} style={{ width: '100vw' }} container direction={'row'}>
      <Grid item xs={showChat ? 6 : 8}>
        <LiveStreamPanel streams={streams} />
      </Grid>
      <Grid item xs={showChat ? 3 : 4}>
        <Grid container direction={'column'} className={'h-100'}>
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
        <Grid item xs={3} className="h-100 w-100">
          <iframe
            className={'h-100 w-100'}
            frameBorder="0"
            scrolling="no"
            src="https://www.twitch.tv/embed/theorangealliance/chat?darkpopout&parent=theorangealliance.org"
            // src="https://www.twitch.tv/embed/theorangealliance/chat?darkpopout&parent=localhost"
          ></iframe>
        </Grid>
      )}
    </Grid>
  );
};

export default OnePlusThree;
