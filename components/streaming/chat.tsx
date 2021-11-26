import React from 'react';
import { Close, Equalizer } from '@mui/icons-material';
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
import { EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';

interface StreamingChatProps {
  channel?: string;
}

const StreamingChat: React.FC<StreamingChatProps> = ({ channel }) => {
  return (
    <iframe
      style={{ width: '100%', height: '100%' }}
      frameBorder="0"
      scrolling="no"
      src={`https://www.twitch.tv/embed/${
        channel || 'theorangealliance'
      }/chat?darkpopout&parent=theorangealliance.org&parent=localhost`}
    />
  );
};

export default StreamingChat;
