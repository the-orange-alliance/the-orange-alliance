import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { Grid } from '@mui/material';
import LiveStreamPanel from '../LiveStreamPanel';

const Hex = ({ streams, showChat }: { streams: EventLiveStream[]; showChat: boolean }) => {
  return (
    <Grid
      className={'m-0 h-100'}
      style={{ width: '100vw' }}
      container
      direction={'row'}
      columns={showChat ? 24 : 12}
    >
      <Grid item xs={showChat ? 9 : 6}>
        <Grid container direction={'column'} className={'h-100'}>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={showChat ? 9 : 6}>
        <Grid container direction={'column'} className={'h-100'}>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
          <Grid item xs={showChat ? 8 : 4}>
            <LiveStreamPanel streams={streams} />
          </Grid>
        </Grid>
      </Grid>
      {showChat && (
        <Grid item xs={6} className="h-100 w-100">
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

export default Hex;
