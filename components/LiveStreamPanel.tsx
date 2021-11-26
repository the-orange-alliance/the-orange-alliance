import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { useTranslate } from '../i18n/i18n';
import { ChangeEvent, useState } from 'react';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { Close, Equalizer } from '@mui/icons-material';

const LiveStreamPanel = ({ streams }: { streams: EventLiveStream[] }) => {
  const t = useTranslate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStream, setSelectedStream] = useState<EventLiveStream | null>(null);

  const selectStream = (stream: EventLiveStream) => {
    setSelectedStream(stream);
    setModalOpen(false);
  };

  return (
    <>
      <Box className={'stream embed-responsive embed-responsive-16by9'}>
        {!selectedStream && (
          <Button variant={'contained'} color={'primary'} onClick={() => setModalOpen(true)}>
            {t('pages.streams.select_stream')}
          </Button>
        )}
        {selectedStream && (
          <Grid container direction={'column'} className={'h-100'}>
            <Grid item className={'stream-iframe mb-0'}>
              <iframe
                className="embed-responsive-item m-0 p-0 w-100 h-100"
                // src={`${selectedStream.streamURL}&parent=theorangealliance.org`}
                src={`${selectedStream.streamURL}&parent=localhost`}
                allowFullScreen
              />
            </Grid>
            <Grid item className={'stream-info mt-0'}>
              <Grid container direction={'row'} className="info-icons">
                <Grid item className={'p-1'}>
                  <Typography variant={'subtitle1'}>{selectedStream.streamName}</Typography>
                </Grid>
                <Grid item className="toa-tooltip">
                  {selectedStream && selectedStream.eventKey && (
                    <IconButton
                      size={'small'}
                      href={`events/${selectedStream.eventKey}`}
                      target="_blank"
                    >
                      <Equalizer />
                    </IconButton>
                  )}
                  <span className="tooltiptext">{t('pages.streams.event_results')}</span>
                </Grid>
                <Grid item className="toa-tooltip">
                  <IconButton onClick={() => setSelectedStream(null)} size={'small'}>
                    <Close />
                  </IconButton>
                  <span className=" tooltiptext">{t('pages.streams.close_stream')}</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Stream Selection Dialog */}
      <Dialog open={modalOpen}>
        <DialogTitle>{t('pages.streams.select_stream')}</DialogTitle>
        <DialogContent>
          <List>
            <RadioGroup>
              {streams
                .filter(s => s.isActive)
                .map(s => (
                  <ListItem key={s.streamKey}>
                    <FormControlLabel
                      label={s.streamName}
                      control={<Radio value={s.streamKey} onChange={() => selectStream(s)} />}
                    />
                  </ListItem>
                ))}
            </RadioGroup>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveStreamPanel;
