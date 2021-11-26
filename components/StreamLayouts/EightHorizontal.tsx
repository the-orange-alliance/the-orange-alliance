import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { Grid } from '@mui/material';
import LiveStreamPanel from '../LiveStreamPanel';

const EightHorizontal = ({
  streams,
  showChat
}: {
  streams: EventLiveStream[];
  showChat: boolean;
}) => {
  return (
    <Grid container className={'m-0 h-100'} style={{ width: '100vw' }} direction={'row'}>
      <Grid item className={'h-100'} xs={showChat ? 9 : 12}>
        <Grid container className={'h-100'} direction={'column'}>
          <Grid item xs={6}>
            <Grid container direction={'row'} className={'h-100'}>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction={'row'} className={'h-100'}>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
              <Grid item xs={3}>
                <LiveStreamPanel streams={streams} />
              </Grid>
            </Grid>
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

export default EightHorizontal;
