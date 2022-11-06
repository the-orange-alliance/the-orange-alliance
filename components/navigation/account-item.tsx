import React, { forwardRef, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Avatar, Box, Button, ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TOAUser from '../../lib/TOAUser';
import { useTranslate } from '../../i18n/i18n';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchUserData,
  getAuthInstance,
  inStartupState,
  isLoggedIn
} from '../../providers/FirebaseProvider';

const initials = (name: string) => {
  const [firstName, lastName] = name.split(' ');
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
};

const AccountItem = () => {
  const [user, setUser] = useState<TOAUser>();
  const theme = useTheme();
  const t = useTranslate();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = () =>
      fetchUserData().then(user => {
        setUser(user);
      });

    const unsubscribe = onAuthStateChanged(getAuthInstance(), user => {
      if (user) {
        fetchUser();
      } else {
        setUser(undefined);
      }
    });
    if (!inStartupState() || isLoggedIn()) {
      fetchUser();
    }
  }, []);

  return (
    <>
      {!user ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            py: 2,
            px: 2,
            mx: 1,
            my: 0.5,
            marginBottom: 0,
            paddingBottom: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1,
            color: theme.palette.text.secondary
          }}
        >
          {/* <Box sx={{ mr: 3 }}>{icon}</Box> */}

          <Grid container direction={'column'} justifyContent="center">
            <Grid item>
              {t('drawer.mytoa.hello').replace('{{ name }}', t('drawer.mytoa.guest'))}
            </Grid>
            <Grid item>
              <Grid container direction={'row'}>
                <Grid item>
                  <Button
                    size={'small'}
                    onClick={() => router.push({ pathname: '/account/login' })}
                  >
                    {t('drawer.mytoa.login')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size={'small'}
                    onClick={() => router.push({ pathname: '/account/register' })}
                  >
                    {t('drawer.mytoa.register')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <NextLink href="/account" passHref>
          <ButtonBase
            component="a"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              py: 1,
              px: 2,
              mx: 1,
              my: 0.5,
              borderRadius: 1,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            <Avatar
              src={user.photoURL}
              sx={{
                width: '2rem',
                height: '2rem',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontSize: '0.875em',
                mr: 2
              }}
            >
              {initials(user.displayName)}
            </Avatar>

            <Stack>
              <Typography fontWeight={500} fontSize="0.875rem">
                <b>{user.displayName}</b>
              </Typography>
              <Typography color="text.secondary" fontSize="0.75rem">
                {user.email}
              </Typography>
            </Stack>
          </ButtonBase>
        </NextLink>
      )}

      <style jsx>{`
        .avatar {
          flex: none;
          width: 32px;
          height: 32px;
          line-height: 32px;
          border-radius: 50%;
          background: #ececec;
          border: 1px solid #d8d8d8;
          font-size: 32px;
          color: #000;
          text-align: center;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default AccountItem;
