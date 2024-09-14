import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import EventResultsIcon from '@mui/icons-material/EqualizerRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import StreamIcon from '@mui/icons-material/VideocamRounded';
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../../i18n/i18n';

const LiveStreamPanel = ({
  streams,
  readFromQuery
}: {
  streams: EventLiveStream[];
  readFromQuery?: boolean;
}) => {
  const t = useTranslate();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStream, setSelectedStream] = useState<EventLiveStream | null>(
    readFromQuery ? streams.find(stream => stream.eventKey === router.query.e) ?? null : null
  );

  const selectStream = (stream: EventLiveStream) => {
    setSelectedStream(stream);
    setModalOpen(false);
  };

  return (
    <>
      <div className="stream-panel">
        {selectedStream ? (
          <>
            <iframe
              src={`${selectedStream.streamURL}${
                selectedStream.streamURL.indexOf('twitch') > -1
                  ? '&parent=theorangealliance.org&parent=localhost'
                  : ''
              }`}
              frameBorder="0"
              scrolling="no"
              allowFullScreen
            />
            <div className="stream-info">
              <Typography variant="subtitle2" noWrap sx={{ pr: 1 }}>
                {selectedStream.streamName}
              </Typography>
              <div className="stream-info__icons">
                <Tooltip title={t('pages.streams.event_results')}>
                  <NextLink href={`/events/${selectedStream.eventKey}`} passHref target="_blank">
                    <IconButton component="a" sx={{ color: '#fff' }}>
                      <EventResultsIcon />
                    </IconButton>
                  </NextLink>
                </Tooltip>
                <Tooltip title={t('pages.streams.close_stream')}>
                  <IconButton
                    sx={{ color: '#fff', ml: 'auto' }}
                    onClick={() => setSelectedStream(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </>
        ) : (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => setModalOpen(true)}
          >
            {t('pages.streams.select_stream')}
          </Button>
        )}
      </div>

      {/* Stream Selection Dialog */}
      <Dialog open={modalOpen}>
        <DialogTitle>{t('pages.streams.select_stream')}</DialogTitle>
        <DialogContent>
          <List>
            {streams
              .filter(s => s.isActive)
              .map(s => (
                <ListItemButton onClick={() => selectStream(s)} key={s.streamKey}>
                  <ListItemIcon>
                    <StreamIcon />
                  </ListItemIcon>
                  <ListItemText primary={s.streamName} />
                </ListItemButton>
              ))}
          </List>
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .stream-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #000;
          outline: #333 solid 1px;
          padding: 0;
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .stream-panel iframe {
          flex: 1;
          width: 100%;
        }
        .stream-info {
          height: 3rem;
          padding: 0 2rem;
          width: 100%;
          color: #fff;
          background: #1a1a1a;
          display: flex;
          align-items: center;
        }
        .stream-info__icons {
          display: flex;
          flex: 1;
        }
      `}</style>
    </>
  );
};

export default LiveStreamPanel;
