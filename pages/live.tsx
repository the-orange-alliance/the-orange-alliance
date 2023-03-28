import React, { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  ListItemButton,
  List
} from '@mui/material';
import { useTranslate } from '../i18n/i18n';
import {
  fetchStreamsData,
  IRawStreamsProps,
  useStreamsData
} from '../lib/page-helpers/streams-helper';
import * as Layouts from '../components/streaming/layouts';
import SEO from '../components/seo';

interface StreamView {
  id: string;
  svgPath: string;
  mobile?: boolean;
  container: React.ElementType;
}

const views: StreamView[] = [
  {
    id: 'single_view',
    svgPath: 'M0 0h23v15h-23v-15z',
    mobile: true,
    container: Layouts.SingleView
  },
  {
    id: 'vertical_split_view',
    svgPath: 'M0 0h11v15h-11v-15zM12 0h11v15h-11v-15z',
    container: Layouts.DualVerticalView
  },
  {
    id: 'horizontal_split_view',
    svgPath: 'M0 0h23v7h-23v-7z M0 8h23v7h-23v-7z',
    mobile: true,
    container: Layouts.DualHorizontalView
  },
  {
    id: '1_2_view',
    svgPath: 'M0 0h14v15h-14v-15zM15 0h8v7h-8v-7zM15 8h8v7h-8v-7z',
    container: Layouts.OnePlusTwoView
  },
  {
    id: '1_3_view',
    svgPath: 'm0 0h15v14h-15zm16 0h7v4h-7v-4m0 10v4h7v-4h-7m7-1v-4 4h-7v-4h7',
    container: Layouts.OnePlusThreeView
  },
  {
    id: '1_4_view',
    svgPath:
      'M0 0h15v15h-15v-15z M16 0h7v3h-7v-3z M16 4h7v3h-7v3z M16 8h7v3h-7v-3z M16 12h7v3h-7v-3z',
    container: Layouts.OnePlusFourView
  },
  {
    id: '1_6_view',
    svgPath:
      'm0 0h15v11h-15v-15zm16 0h7v3h-7v-3zm0 4h7v3h-7v3zm0 4h7v3h-7v-3zm0 4h7v3h-7v-3zm-16 0h7v3h-7v-3m8 0h7v3h-7v-3',
    container: Layouts.OnePlusSixView
  },
  {
    id: 'quad_view',
    svgPath: 'M0 0h11v7h-11v-7z M0 8h11v7h-11v-7z M12 0h11v7h-11v-7z M12 8h11v7h-11v-7z',
    container: Layouts.QuadView
  },
  {
    id: '6_view',
    svgPath: 'm0 0v6h7v-6zm0 9h7v6h-7zm8-3v-6h7v6h-7m8 0h7v-6h-7v6m-8 3h7v6h-7v-6m8 0h7v6h-7v-6',
    container: Layouts.HexView
  },
  {
    id: '8_view_horiz',
    svgPath:
      'm0 0h5v7h-5zm6 0h5v7h-5v-7m6 0h5v7h-5v-7m-12 8h5v7h-5v-7m18-1h5v-7h-5v7m-12 8v-7h5v7h-5m6-7v7h5v-7h-5m6 0h5v7h-5v-7',
    container: Layouts.EightHorizontalView
  },
  {
    id: '8_view_vert',
    svgPath:
      'm0 0h11v3h-11zm16 0h7v3h-11v-3zm7 4v3h-11v-3zm-7 4h7v3h-11v-3zm0 4h7v3h-11v-3zm-16-8h11v3h-11v-3m0 4h11v3h-11v-3m0 4h11v3h-11v-3',
    container: Layouts.EightVerticalView
  },
  {
    id: '3_3_view',
    svgPath:
      'm0 0h7v4h-7zm8 0h7v4h-7v-4m8 0h7v4h-7v-4m-16 10h7v4h-7v-4m8 4v-4h7v4h-7m8-4v4h7v-4h-7m7-1v-4 4h-7v-4h7m-23 0h7v4h-7v-4m8 0h7v4h-7v-4',
    container: Layouts.NineView
  }
];

const Streams: NextPage<IRawStreamsProps> = props => {
  const { streams } = useStreamsData(props);
  const t = useTranslate();
  const [showChat, setShowChat] = useState<boolean>(true);
  const [selectedLayout, setSelectedLayout] = useState<StreamView | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const LayoutContainer = useMemo(() => selectedLayout?.container, [selectedLayout]);

  useEffect(() => {
    // If query param is set, use the basic layout
    if (router.query.e) {
      setSelectedLayout(views[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEO title="Watch" description="Watch live FIRST Tech Challenge events." />

      <Box
        component={Box}
        sx={{
          height: 'calc(100vh - var(--toa-navbar-height))',
          bgcolor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {LayoutContainer ? (
          <LayoutContainer streams={streams} showChat={showChat && !smallScreen} />
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                bgcolor: '#141414',
                mx: 4,
                my: 'auto',
                width: 400,
                maxWidth: '100%',
                borderRadius: 2,
                maxHeight: '90%',
                overflow: 'hidden'
              }}
            >
              <Typography variant="h6" sx={{ p: 2 }}>
                {t('pages.streams.layouts.title')}
              </Typography>
              <List sx={{ overflowY: 'auto', borderTop: 1, borderColor: 'divider', px: 2 }}>
                {views
                  .filter(v => (isMobile ? v.mobile : true))
                  .map(v => (
                    <ListItemButton
                      key={v.id}
                      dense
                      sx={{ my: 0.5, py: 1 }}
                      onClick={() => setSelectedLayout(v)}
                    >
                      <ListItemIcon>
                        <svg
                          style={{ width: 25, height: 20, fill: 'rgba(255, 255, 255, 0.4)' }}
                          viewBox="0 0 23 15"
                        >
                          <path d={v.svgPath} />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
                        {t('pages.streams.layouts.' + v.id)}
                      </ListItemText>
                    </ListItemButton>
                  ))}
              </List>
              {!smallScreen && (
                <FormControlLabel
                  control={
                    <Checkbox checked={showChat} onChange={e => setShowChat(e.target.checked)} />
                  }
                  label={t('pages.streams.show_chat')}
                  sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: await fetchStreamsData() };
};

export default Streams;
