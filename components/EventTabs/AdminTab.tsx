import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { Event, EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import TOAUser from '../../lib/TOAUser';
import { useTranslate } from '../../i18n/i18n';
import { Link, LinkOff, Upload, YouTube } from '@mui/icons-material';
import { addEventMedia, updateStream, updateEvent } from '../../providers/FirebaseProvider';
import { uploadToImgur } from '../../providers/ImgurProvider';
import StreamType from '@the-orange-alliance/api/lib/cjs/models/types/StreamType';
import { useAppContext } from '../../lib/toa-context';
import toast from 'react-hot-toast';

interface IProps {
  event: Event;
  user: TOAUser;
  streams: EventLiveStream[];
  handleStreamChange: (stream: EventLiveStream, add: boolean) => void;
}

type EditableEventProp =
  | 'name'
  | 'venue'
  | 'website'
  | 'city'
  | 'start_date'
  | 'state'
  | 'end_date'
  | 'country'
  | 'league_key';

const AdminTab = ({ event, streams, user, handleStreamChange }: IProps) => {
  const t = useTranslate();
  const { leagues } = useAppContext();
  const [localStreams, setLocalStreams] = useState<EventLiveStream[]>(
    streams.filter(s => s.isActive)
  );
  const [editableEvent, setEditableEvent] = useState<Event>(new Event().fromJSON(event.toJSON()));

  const [schedulePhoto, setSchedulePhoto] = useState<File | null>(null);
  const [pitPhoto, setPitPhoto] = useState<File | null>(null);
  const [venuePhoto, setVenuePhoto] = useState<File | null>(null);
  const [stream, setStream] = useState<string>(
    localStreams.length > 0 ? localStreams[0].streamURL : ''
  );
  const [streamName, setStreamName] = useState<string>(
    localStreams.length > 0 ? localStreams[0].streamName : ''
  );
  const [provider, setProvider] = useState<string>(
    localStreams.length > 0
      ? localStreams[0].streamType === StreamType.YouTube
        ? 'Youtube'
        : 'Twitch'
      : 'Youtube'
  );

  const cardSx = { border: '1px solid', borderColor: 'divider', m: 1 };

  const updateEventProp = (prop: EditableEventProp, val: string | null) => {
    const temp = new Event().fromJSON(editableEvent.toJSON());
    if (prop !== 'league_key' && !val) return;
    switch (prop) {
      case 'name':
        if (!val) return;
        temp.eventName = val;
        break;
      case 'venue':
        if (!val) return;
        temp.venue = val;
        break;
      case 'website':
        if (!val) return;
        temp.website = val;
        break;
      case 'city':
        if (!val) return;
        temp.city = val;
        break;
      case 'start_date':
        if (!val) return;
        temp.startDate = val;
        break;
      case 'end_date':
        if (!val) return;
        temp.endDate = val;
        break;
      case 'state':
        if (!val) return;
        temp.stateProv = val;
        break;
      case 'country':
        if (!val) return;
        temp.country = val;
        break;
      case 'league_key':
        temp.leagueKey = val;
        break;
    }
    setEditableEvent(temp);
  };

  const muiDate = (date: string) => {
    const d = new Date(date);
    const pad = (n: number) => (n + 1 < 10 ? '0' + (n + 1) : n + 1);
    return d.getFullYear() + '-' + pad(d.getMonth()) + '-' + pad(d.getDate());
  };

  const uploadImage = (file: File | null, id: string) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (!reader.result) throw new Error('No result from file');
        const res = reader.result.toString();
        if (!window) throw new Error('No window defined');
        const base64 = window.btoa(res);
        uploadToImgur(base64)
          .then(data => {
            const link = data.data.link;
            const mediaData = {
              event_key: event.eventKey,
              primary: false,
              media_link: link,
              media_type: -1
            } as any;

            if (id === 'pits-upload') {
              mediaData.media_type = 0;
            } else if (id === 'schedule-upload') {
              mediaData.media_type = 1;
            } else if (id === 'venue-upload') {
              mediaData.media_type = 2;
            }

            return addEventMedia(mediaData);
          })
          .then(() => {
            toast.success(t('pages.event.settings.saved'));

            // Clear Upload field
            if (!document) return;
            const el = document.getElementById(id);
            if (el) {
              el.setAttribute('value', '');
            }
          })
          .catch(() => {
            toast.success(t('pages.event.settings.failed'));
          });
      };
      reader.readAsBinaryString(file);
    }
  };

  const linkStream = () => {
    let streamLink: string = '';
    let channelLink: string = '';
    let channelName: string = '';
    let streamType: StreamType = StreamType.Unknown;
    const twitchRegex = new RegExp(
      '^(?:https?:\\/\\/)?(?:www\\.|go\\.)?twitch\\.tv\\/([a-zA-Z0-9_-]+)($|\\?)?'
    );
    const youtubeRegex = new RegExp(
      '(?:youtube(?:-nocookie)?\\.com\\/(?:[^\\/\\n\\s]+\\/\\S+\\/|(?:v|e(?:mbed)?)\\/|\\S*?[?&]v=)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})'
    );
    if (provider === 'Twitch' && twitchRegex.exec(stream)) {
      // @ts-ignore
      const channelId = twitchRegex.exec(stream)[1];
      streamLink = 'https://player.twitch.tv/?channel=' + channelId;
      channelLink = 'https://twitch.tv/' + channelId;
      channelName = channelId;
      streamType = StreamType.Twitch;
    } else if (provider === 'Youtube' && youtubeRegex.exec(stream)) {
      // @ts-ignore
      const vidId = youtubeRegex.exec(stream)[1];
      streamLink = 'https://www.youtube.com/embed/' + vidId;
      channelLink = 'https://www.youtube.com/watch?v=' + vidId;
      channelName = ''; // TODO: Implement Youtube API in here at some point
      streamType = StreamType.YouTube;
    }

    console.log(streamLink);

    if (streamLink) {
      const stream = new EventLiveStream();
      stream.streamKey = event.eventKey + '-LS1';
      stream.eventKey = event.eventKey;
      stream.channelName = channelName;
      stream.streamName = streamName;
      stream.streamType = streamType;
      stream.isActive = true;
      stream.streamURL = streamLink;
      stream.startDateTime = new Date(event.startDate).toJSON().slice(0, 19).replace('T', ' ');
      stream.endDateTime = new Date(event.endDate).toJSON().slice(0, 19).replace('T', ' ');
      stream.channelURL = channelLink;

      updateStream(stream)
        .then(() => {
          handleStreamChange(stream, true);
          setLocalStreams([...localStreams, stream]);
          toast.success(t('pages.event.settings.saved'));
        })
        .catch(() => {
          toast.error(t('pages.event.settings.failed'));
        });
    }
  };

  const unlinkStream = () => {
    if (localStreams.length > 0 && localStreams[0]) {
      localStreams[0].startDateTime = new Date(event.startDate)
        .toJSON()
        .slice(0, 19)
        .replace('T', ' ');
      localStreams[0].endDateTime = new Date(event.endDate).toJSON().slice(0, 19).replace('T', ' ');
      localStreams[0].isActive = false;
      updateStream(localStreams[0])
        .then(() => {
          handleStreamChange(localStreams[0], false);
          setLocalStreams([...localStreams.filter(s => s.streamKey !== localStreams[0].streamKey)]);
          toast.success(t('pages.event.settings.saved'));
        })
        .catch(() => {
          toast.error(t('pages.event.settings.failed'));
        });
    }
  };

  const updateEventCloud = () => {
    updateEvent(editableEvent)
      .then(() => {
        toast.success(t('pages.event.settings.saved'));
      })
      .catch(() => {
        toast.error(t('pages.event.settings.failed'));
      });
  };

  return (
    <Grid container direction={'row'}>
      {/* Left Column */}
      <Grid item xs={12} md={6}>
        {/*<Card sx={cardSx}>*/}
        {/*  <CardContent>*/}
        {/*    <Typography sx={{ mb: 4 }} variant={'h6'}>*/}
        {/*      {t('pages.account.datasync_card.title')}*/}
        {/*    </Typography>*/}
        {/*    <Button variant={'contained'}>*/}
        {/*      <Autorenew />*/}
        {/*      Start Datasync*/}
        {/*    </Button>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
        <Card sx={cardSx}>
          <CardContent>
            <Typography sx={{ mb: 4 }} variant={'h6'}>
              {t('pages.event.subpages.admin.update_info_card.title')}
            </Typography>
            <Grid container direction={'row'} spacing={2}>
              {/* Edit Event Left Column */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.eventName}
                  onChange={e => updateEventProp('name', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.event_name')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.website}
                  onChange={e => updateEventProp('website', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.website')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  type={'date'}
                  fullWidth
                  value={muiDate(editableEvent.startDate)}
                  onChange={e =>
                    updateEventProp('start_date', new Date(e.target.value).toISOString())
                  }
                  label={t('pages.event.subpages.admin.update_info_card.start_date')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  type={'date'}
                  fullWidth
                  value={muiDate(editableEvent.startDate)}
                  onChange={e =>
                    updateEventProp('end_date', new Date(e.target.value).toISOString())
                  }
                  label={t('pages.event.subpages.admin.update_info_card.end_date')}
                  sx={{ mb: 1 }}
                />
              </Grid>

              {/* Edit Event Right Column */}
              <Grid item xs={12} sm={6}>
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.venue}
                  onChange={e => updateEventProp('venue', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.venue')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.city}
                  onChange={e => updateEventProp('city', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.city')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.stateProv}
                  onChange={e => updateEventProp('state', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.state')}
                  sx={{ mb: 1 }}
                />
                <TextField
                  variant={'outlined'}
                  fullWidth
                  value={editableEvent.country}
                  onChange={e => updateEventProp('country', e.target.value)}
                  label={t('pages.event.subpages.admin.update_info_card.country')}
                  sx={{ mb: 1 }}
                />
              </Grid>
            </Grid>
            <Autocomplete
              key={editableEvent.leagueKey}
              sx={{ mb: 1 }}
              disablePortal
              options={leagues}
              getOptionLabel={l => l.leagueKey + ' - ' + l.description}
              value={leagues.find(l => l.leagueKey === editableEvent.leagueKey)}
              isOptionEqualToValue={(a, b) => a.leagueKey === b.leagueKey}
              onChange={(e, v) => updateEventProp('league_key', v?.leagueKey ?? null)}
              renderInput={params => (
                <TextField
                  {...params}
                  variant={'outlined'}
                  label={t('pages.account.create_event_card.league')}
                />
              )}
            />
            <Button fullWidth variant={'contained'} onClick={updateEventCloud}>
              <Upload />
              {t('pages.event.subpages.admin.update_info_card.update')}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6}>
        <Card sx={cardSx}>
          <CardContent>
            <Typography sx={{ mb: 4 }} variant={'h6'}>
              {t('pages.event.subpages.admin.playlist_card.title')}
            </Typography>
            <Typography sx={{ mb: 4 }} variant={'body1'}>
              Coming soon...
            </Typography>
          </CardContent>
        </Card>
        <Card sx={cardSx}>
          <CardContent>
            <Typography variant={'h6'}>
              {t('pages.event.subpages.for-participants.schedule')}
            </Typography>
            <Typography sx={{ mb: 1 }} variant={'body1'}>
              {t('pages.event.subpages.admin.update_info_card.image_only')}
            </Typography>
            <TextField
              fullWidth
              id={'schedule-upload'}
              type={'file'}
              variant={'outlined'}
              onChange={e => setSchedulePhoto((e.target as any)?.files[0] ?? null)}
            />
            <Button
              sx={{ mt: 1 }}
              variant={'contained'}
              fullWidth
              disabled={!schedulePhoto}
              onClick={() => uploadImage(schedulePhoto, 'schedule-upload')}
            >
              <Upload />
              {t('pages.event.subpages.admin.update_info_card.upload')}
            </Button>
          </CardContent>
        </Card>
        <Card sx={cardSx}>
          <CardContent>
            <Typography variant={'h6'}>
              {t('pages.event.subpages.for-participants.pits_map')}
            </Typography>
            <Typography sx={{ mb: 1 }} variant={'body1'}>
              {t('pages.event.subpages.admin.update_info_card.image_only')}
            </Typography>
            <TextField
              fullWidth
              id={'pit-upload'}
              type={'file'}
              variant={'outlined'}
              onChange={e => setPitPhoto((e.target as any)?.files[0] ?? null)}
            />
            <Button
              key={pitPhoto?.name}
              sx={{ mt: 1 }}
              variant={'contained'}
              fullWidth
              disabled={!pitPhoto}
              onClick={() => uploadImage(pitPhoto, 'pit-upload')}
            >
              <Upload />
              {t('pages.event.subpages.admin.update_info_card.upload')}
            </Button>
          </CardContent>
        </Card>
        <Card sx={cardSx}>
          <CardContent>
            <Typography variant={'h6'}>
              {t('pages.event.subpages.for-participants.venue_map')}
            </Typography>
            <Typography sx={{ mb: 1 }} variant={'body1'}>
              {t('pages.event.subpages.admin.update_info_card.image_only')}
            </Typography>
            <TextField
              fullWidth
              id={'venue-upload'}
              type={'file'}
              variant={'outlined'}
              onChange={e => setVenuePhoto((e.target as any)?.files[0] ?? null)}
            />
            <Button
              sx={{ mt: 1 }}
              variant={'contained'}
              fullWidth
              disabled={!venuePhoto}
              onClick={() => uploadImage(venuePhoto, 'venue-upload')}
            >
              <Upload />
              {t('pages.event.subpages.admin.update_info_card.upload')}
            </Button>
          </CardContent>
        </Card>{' '}
        <Card sx={cardSx}>
          <CardContent>
            <Typography variant={'h6'}>
              {t('pages.event.subpages.admin.stream_card.add_stream')}
            </Typography>
            <RadioGroup row onChange={e => setProvider(e.target.value)} value={provider}>
              <FormControlLabel
                disabled={localStreams.length > 0}
                value={'Youtube'}
                control={<Radio />}
                label="Youtube"
              />
              <FormControlLabel
                disabled={localStreams.length > 0}
                value={'Twitch'}
                control={<Radio />}
                label="Twitch"
              />
            </RadioGroup>
            <TextField
              fullWidth
              sx={{ mb: 1 }}
              label={t('pages.event.subpages.admin.stream_card.url').replace(
                '{{ provider }}',
                provider
              )}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {provider === 'Youtube' && <YouTube />}
                  </InputAdornment>
                )
              }}
              disabled={localStreams.length > 0}
              variant={'outlined'}
              value={stream}
              onChange={e => setStream(e.target?.value ?? '')}
            />
            <TextField
              fullWidth
              label={t('pages.event.subpages.admin.stream_card.stream_name')}
              variant={'outlined'}
              disabled={localStreams.length > 0}
              value={streamName}
              onChange={e => setStreamName(e.target?.value ?? '')}
            />
            <Button
              sx={{ mt: 1, display: localStreams.length > 0 ? 'none' : undefined }}
              variant={'contained'}
              fullWidth
              disabled={stream === '' || streamName === ''}
              onClick={linkStream}
            >
              <Link />
              {t('pages.event.subpages.admin.stream_card.link')}
            </Button>
            <Button
              sx={{ mt: 1, display: localStreams.length === 0 ? 'none' : undefined }}
              variant={'contained'}
              fullWidth
              disabled={stream === '' || streamName === ''}
              onClick={unlinkStream}
            >
              <LinkOff />
              {t('pages.event.subpages.admin.stream_card.unlink')}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminTab;
