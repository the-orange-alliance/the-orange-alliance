import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider } from '@mui/material';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeIcon from '@mui/icons-material/HomeRounded';
import EventsIcon from '@mui/icons-material/EventRounded';
import TeamsIcon from '@mui/icons-material/GroupsRounded';
import InsightsIcon from '@mui/icons-material/Insights';
import StreamingIcon from '@mui/icons-material/VideocamRounded';
import APIIcon from '@mui/icons-material/CodeRounded';
import AddDataIcon from '@mui/icons-material/PublishRounded';
import AboutIcon from '@mui/icons-material/InfoOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LegalIcon from '@mui/icons-material/DescriptionRounded';
import { useTranslate } from '../../i18n/i18n';
import DrawerItem from './drawer-item';
import TOAUser from '../../lib/TOAUser';

const DrawerContent = ({ toaUser }: { toaUser: TOAUser | undefined }) => {
  const router = useRouter();
  const t = useTranslate();

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <Box my={1}>
        <DrawerItem
          title="myTOA"
          href="/account"
          icon={<AccountIcon />}
          toaUser={toaUser}
          isMyToa={true}
        />
      </Box>
      <Divider light />
      <DrawerItem
        title={t('drawer.home')}
        href="/"
        icon={<HomeIcon />}
        isActive={router.route === '/'}
      />
      <DrawerItem
        title={t('drawer.events')}
        href="/events"
        icon={<EventsIcon />}
        isActive={router.route.startsWith('/events')}
      />
      <DrawerItem
        title={t('drawer.teams')}
        href="/teams"
        icon={<TeamsIcon />}
        isActive={router.route.startsWith('/teams')}
      />
      <DrawerItem
        title={t('drawer.insights')}
        href="/insights/quals"
        icon={<InsightsIcon />}
        isActive={router.route.startsWith('/insights')}
      />
      <DrawerItem
        title={t('drawer.streaming')}
        href="/live"
        icon={<StreamingIcon />}
        isActive={router.route === '/live'}
      />
      <Divider light />
      <DrawerItem
        title={t('drawer.api')}
        href="/apidocs"
        icon={<APIIcon />}
        isActive={router.route === '/apidocs'}
      />
      <DrawerItem
        title={t('drawer.add_data')}
        href="/add-data"
        icon={<AddDataIcon />}
        isActive={router.route === '/add-data'}
      />
      <Divider light />
      <DrawerItem
        title={t('drawer.about')}
        href="/about"
        icon={<AboutIcon />}
        isActive={router.route === '/about'}
      />
      <DrawerItem
        title={t('drawer.open_source')}
        href="https://github.com/orange-alliance"
        icon={<GitHubIcon />}
      />
      <DrawerItem
        title={t('drawer.legal_notices')}
        href="/legal"
        icon={<LegalIcon />}
        isActive={router.route === '/legal'}
      />
    </Box>
  );
};

export default DrawerContent;
