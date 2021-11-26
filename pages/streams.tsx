import type { GetServerSideProps, NextPage } from 'next';
import { useTranslate } from '../i18n/i18n';
import React, { useState } from 'react';
import {
  getStreamsData,
  IRawStreamsProps,
  parseStreamsProps
} from '../lib/PageHelpers/streamsHelper';
import {
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  SingleView,
  DualVertical,
  DualHorizontal,
  OnePlusTwo,
  OnePlusFour,
  Quad,
  OnePlusThree,
  Hex,
  OnePlusSix,
  EightHorizontal,
  Nine
} from '../components/StreamLayouts';
import EightVertial from '../components/StreamLayouts/EightVertical';

interface StreamView {
  svgPath: string;
  name: string;
  layoutKey: number;
  container: JSX.Element;
}

const Streams: NextPage<IRawStreamsProps> = props => {
  const t = useTranslate();
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [showChat, setShowChat] = useState<boolean>(true);
  const [selectedLayout, setSelectedLayout] = useState<StreamView | null>(null);

  const { streams } = parseStreamsProps(props);

  const views: StreamView[] = [
    {
      svgPath: 'M0 0h23v15h-23v-15z',
      name: t('pages.streams.layouts.single_view'),
      layoutKey: 0,
      container: <SingleView streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'M0 0h11v15h-11v-15zM12 0h11v15h-11v-15z',
      name: t('pages.streams.layouts.vertical_split_view'),
      layoutKey: 1,
      container: <DualVertical streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'M0 0h23v7h-23v-7z M0 8h23v7h-23v-7z',
      name: t('pages.streams.layouts.horizontal_split_view'),
      layoutKey: 2,
      container: <DualHorizontal streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'M0 0h14v15h-14v-15zM15 0h8v7h-8v-7zM15 8h8v7h-8v-7z',
      name: t('pages.streams.layouts.1_2_view'),
      layoutKey: 3,
      container: <OnePlusTwo streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'm0 0h15v14h-15zm16 0h7v4h-7v-4m0 10v4h7v-4h-7m7-1v-4 4h-7v-4h7',
      name: t('pages.streams.layouts.1_3_view'),
      layoutKey: 6,
      container: <OnePlusThree streams={streams} showChat={showChat} />
    },
    {
      svgPath:
        'M0 0h15v15h-15v-15z M16 0h7v3h-7v-3z M16 4h7v3h-7v3z M16 8h7v3h-7v-3z M16 12h7v3h-7v-3z',
      name: t('pages.streams.layouts.1_4_view'),
      layoutKey: 4,
      container: <OnePlusFour streams={streams} showChat={showChat} />
    },
    {
      svgPath:
        'm0 0h15v11h-15v-15zm16 0h7v3h-7v-3zm0 4h7v3h-7v3zm0 4h7v3h-7v-3zm0 4h7v3h-7v-3zm-16 0h7v3h-7v-3m8 0h7v3h-7v-3',
      name: t('pages.streams.layouts.1_6_view'),
      layoutKey: 8,
      container: <OnePlusSix streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'M0 0h11v7h-11v-7z M0 8h11v7h-11v-7z M12 0h11v7h-11v-7z M12 8h11v7h-11v-7z',
      name: t('pages.streams.layouts.quad_view'),
      layoutKey: 5,
      container: <Quad streams={streams} showChat={showChat} />
    },
    {
      svgPath: 'm0 0v6h7v-6zm0 9h7v6h-7zm8-3v-6h7v6h-7m8 0h7v-6h-7v6m-8 3h7v6h-7v-6m8 0h7v6h-7v-6',
      name: t('pages.streams.layouts.6_view'),
      layoutKey: 7,
      container: <Hex streams={streams} showChat={showChat} />
    },
    {
      svgPath:
        'm0 0h5v7h-5zm6 0h5v7h-5v-7m6 0h5v7h-5v-7m-12 8h5v7h-5v-7m18-1h5v-7h-5v7m-12 8v-7h5v7h-5m6-7v7h5v-7h-5m6 0h5v7h-5v-7',
      name: t('pages.streams.layouts.8_view_horiz'),
      layoutKey: 9,
      container: <EightHorizontal streams={streams} showChat={showChat} />
    },
    {
      svgPath:
        'm0 0h11v3h-11zm16 0h7v3h-11v-3zm7 4v3h-11v-3zm-7 4h7v3h-11v-3zm0 4h7v3h-11v-3zm-16-8h11v3h-11v-3m0 4h11v3h-11v-3m0 4h11v3h-11v-3',
      name: t('pages.streams.layouts.8_view_vert'),
      layoutKey: 10,
      container: <EightVertial streams={streams} showChat={showChat} />
    },
    {
      svgPath:
        'm0 0h7v4h-7zm8 0h7v4h-7v-4m8 0h7v4h-7v-4m-16 10h7v4h-7v-4m8 4v-4h7v4h-7m8-4v4h7v-4h-7m7-1v-4 4h-7v-4h7m-23 0h7v4h-7v-4m8 0h7v4h-7v-4',
      name: t('pages.streams.layouts.3_3_view'),
      layoutKey: 11,
      container: <Nine streams={streams} showChat={showChat} />
    }
  ];

  const selectLayout = (layout: StreamView) => {
    setSelectedLayout(layout);
    setModalOpen(false);
  };

  return (
    <Container className={'m-0 p-0'} style={{ height: '92.8vh', width: '100vw !important' }}>
      {selectedLayout && selectedLayout.container}

      {/* View Selector */}
      <Dialog open={modalOpen}>
        <DialogTitle>{t('pages.streams.layouts.title')}</DialogTitle>
        <DialogContent>
          <List>
            {views.map(v => (
              <ListItem key={v.layoutKey} disablePadding>
                <ListItemButton onClick={() => selectLayout(v)}>
                  <ListItemIcon>
                    <svg style={{ width: '25px', height: '20px' }}>
                      <path d={v.svgPath} />
                    </svg>
                  </ListItemIcon>
                  <ListItemText>{v.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox checked={showChat} onChange={e => setShowChat(e.target.checked)} />
                }
                label={t('pages.streams.show_chat')}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: await getStreamsData() };
};

export default Streams;
