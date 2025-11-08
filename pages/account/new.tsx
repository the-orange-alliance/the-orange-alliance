import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import {
  logout,
  linkProvider,
  unlinkProvider,
  sendPasswordReset,
  changeDisplayName,
  changeEmail,
  cloudMessaging
} from '@/providers/firebase-provider';
import TOAUser from '@/lib/models/toa-user';
import TOAProvider from '@/providers/toa-provider';
import { Team, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '@/i18n/i18n';
import EventItem from '@/components/ui/event-item';
import TeamItem from '@/components/ui/team-item';
import { GitHub, Google, Lock, LockClock } from '@mui/icons-material';
import { readableDate, readableTime } from '@/lib/utils/common';
import { toast } from 'react-hot-toast';
import SEO from '@/components/seo';
import { useAppContext } from '@/lib/toa-context';

import ListItemButton from '@mui/material/ListItemButton';

const AccountPage: NextPage = () => {
  const router = useRouter();
  const t = useTranslate();

  const { user, setUser, regions } = useAppContext();
  const [events, setEvents] = useState<Event[]>();
  const [teams, setTeams] = useState<Team[]>();

  const [notificationsConsent, setNotificationsConsent] = useState<
    'granted' | 'denied' | 'unsupported' | null
  >(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Fetch teams
      const teamPromises = user.favoriteTeams.map(t => TOAProvider.getAPI().getTeam(t));
      Promise.allSettled(teamPromises).then(results =>
        setTeams(
          (results.filter(e => e.status === 'fulfilled') as PromiseFulfilledResult<Team>[]).map(
            result => result.value
          )
        )
      );

      // Fetch events
      const eventPromises = user.favoriteEvents.map(e => TOAProvider.getAPI().getEvent(e));
      Promise.allSettled(eventPromises).then(results =>
        setEvents(
          (results.filter(e => e.status === 'fulfilled') as PromiseFulfilledResult<Event>[]).map(
            result => result.value
          )
        )
      );
    }
  }, [user]);

  useEffect(() => {
    cloudMessaging.isSupported().then(supported => {
      if (!supported) {
        setNotificationsConsent('unsupported');
      } else if (Notification.permission === 'granted') {
        cloudMessaging
          .tokenInlocalforage()
          .then(token => {
            setNotificationsConsent('granted');
            setNotificationsEnabled(!!token);
          })
          .catch(() => setNotificationsConsent('unsupported'));
      } else {
        setNotificationsConsent('denied');
      }
    });
  }, []);

  const doLogoutUser = () => {
    logout().then(() => {
      setUser(null);
      router.push({ pathname: '/account/login' });
    });
  };

  const unlink = (provider: 'github' | 'google') => {
    unlinkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(user?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = false;
            break;
          case 'google':
            newUser.googleLinked = false;
            break;
        }
        setUser(newUser);
      })
      .catch(() => {
        toast.error('general.error_occurred');
      });
  };

  const link = (provider: 'github' | 'google') => {
    linkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(user?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = true;
            break;
          case 'google':
            newUser.googleLinked = true;
            break;
        }
        setUser(newUser);
        toast.success(t('general.success').replace('{{ name }}', provider));
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });
  };

  const reset = () => {
    sendPasswordReset()
      .then(() => {
        toast.success(t('pages.account.reset_password_email'));
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });
  };

  const changeName = () => {
    const name = prompt('Please Enter a New Name:');
    if (name == null) {
      return toast.error(t('general.error_occurred'));
    }

    changeDisplayName(name);
    const newUser = new TOAUser().fromJSON(user?.toJSON());
    newUser.displayName = name;
    setUser(newUser);
    toast.success(t('account.updated_name'));
  };

  const changeEmailAddress = () => {
    const email = prompt('Please Enter a New Email:');

    if (email == null) {
      toast.error(t('general.error_occurred'));
      return;
    }
    const success = changeEmail(email);

    if (success) {
      const newUser = new TOAUser().fromJSON(user?.toJSON());
      newUser.email = email;
      setUser(newUser);
      toast.success(t('account.updated_email'));
    } else {
      toast.error(t('account.fail_update_email'));
    }
  };

  const handleToggleNotifications = () => {
    if (notificationsEnabled) {
      cloudMessaging
        .disable()
        .then(() => {
          setNotificationsEnabled(false);
          toast.success(t('pages.account.notifications_card.disabled'));
        })
        .catch(() => {
          toast.error(t('general.error_occurred'));
        });
    } else {
      cloudMessaging
        .init()
        .then(() => {
          setNotificationsEnabled(true);
          setNotificationsConsent('granted');
          toast.success(t('pages.account.notifications_card.enabled'));
        })
        .catch(() => {
          toast.error(
            t('general.error_occurred') + '. ' + t('pages.account.notifications_card.help')
          );
        });
    }
  };

  return (
    <>
      <SEO title="Account Overview" description="Overview of your TOA account." url="/account" />
      {!user || !user.emailVerified ? (
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 24
          }}
        >
          {!user ? (
            <>
              <CircularProgress size="1.5rem" />
              <Typography fontSize="1.5rem" fontWeight={500} pl={2}>
                {t('general.loading')}
              </Typography>
            </>
          ) : (
            <Stack maxWidth="36rem" textAlign="center">
              <Typography fontSize="1.5rem" fontWeight={500}>
                {t('pages.account.verify_email')}
              </Typography>
              <Typography fontSize="1.125rem" color="text.secondary" mt={1}>
                {t('pages.account.verify_email_description')}
              </Typography>
            </Stack>
          )}
        </Container>
      ) : (
        <Container>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 6
            }}
          >
            <Box pr={4}>
              <Typography fontSize="1.75rem" fontWeight={700}>
                Welcome back, {user.displayName || 'User'}
              </Typography>
            </Box>
            <Button variant="contained" onClick={doLogoutUser}>
              {t('pages.account.logout')}
            </Button>
          </Box>

          <Grid container direction="row" spacing={2}>
            {/* Left Column */}
            <Grid
              size={{
                lg: 7,
                md: 12
              }}
            >
              {/* Favorite Teams/Events */}
              <Card sx={{ p: 3 }}>
                <Grid container direction="row" spacing={2} style={{ width: '100%' }}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}
                  >
                    <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
                      {t('general.teams')}
                    </Typography>
                    {teams && teams.length === 0 && (
                      <Typography sx={{ marginLeft: 2 }} variant="subtitle2">
                        {t('no_data.teams')}
                      </Typography>
                    )}
                    {teams && teams.length > 0 && (
                      <List disablePadding dense>
                        {teams.map(t => (
                          <ListItem key={t.teamKey} sx={{ padding: 0 }}>
                            <TeamItem team={t} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6
                    }}
                  >
                    <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
                      {t('general.events')}
                    </Typography>
                    {teams && teams.length === 0 && (
                      <Typography sx={{ marginLeft: 2 }} variant="subtitle2">
                        {t('no_data.teams')}
                      </Typography>
                    )}
                    {events && events.length > 0 && (
                      <List disablePadding dense>
                        {events.map(e => (
                          <ListItem key={e.eventKey} sx={{ padding: 0 }}>
                            <EventItem event={e} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid
              size={{
                lg: 5,
                md: 12
              }}
            >
              {/* Notifications */}

              {notificationsConsent && (
                <SideCard
                  title="pages.account.notifications_card.title"
                  description="pages.account.notifications_card.summary"
                >
                  {notificationsConsent === 'unsupported' ? (
                    <div>{t('pages.account.notifications_card.unsupported')}</div>
                  ) : (
                    <>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={notificationsEnabled}
                            onChange={handleToggleNotifications}
                            disabled={notificationsConsent !== 'granted'}
                          />
                        }
                        label={t(
                          notificationsEnabled
                            ? 'pages.account.notifications_card.enabled'
                            : 'pages.account.notifications_card.disabled'
                        )}
                      />

                      {notificationsConsent !== 'granted' && (
                        <Button variant="contained" fullWidth onClick={handleToggleNotifications}>
                          {t('pages.account.notifications_card.grant_access')}
                        </Button>
                      )}
                    </>
                  )}
                </SideCard>
              )}

              {/* API Key */}
              <SideCard
                title="pages.account.api_card.title"
                description="pages.account.api_card.description"
              >
                {/* API Key Generated */}
                {user.apiKey ? (
                  <>
                    <Typography variant="subtitle2">
                      {t('pages.account.api_card.your_key')}
                    </Typography>
                    <code className="api-key">{user.apiKey || 'Not found'}</code>
                  </>
                ) : (
                  <Typography fontWeight={500}>
                    {t('pages.account.api_card.generating_key')}
                  </Typography>
                )}

                {/* API Docs */}
                <Typography sx={{ marginTop: 2 }} variant="subtitle1">
                  Check out the{' '}
                  <NextLink href="/apidocs" passHref legacyBehavior>
                    <Link>API Documentation</Link>
                  </NextLink>{' '}
                  for more information.
                </Typography>
              </SideCard>

              {/* Account Settings */}
              <SideCard title="pages.account.account_settings">
                <List>
                  {/* Reset Password */}
                  <ListItemButton onClick={reset}>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText>{t('pages.account.reset_password')}</ListItemText>
                  </ListItemButton>

                  {/* Un/link Google */}
                  <ListItemButton
                    onClick={() => (user.googleLinked ? unlink('google') : link('google'))}
                  >
                    <ListItemIcon>
                      <Google />
                    </ListItemIcon>
                    <ListItemText>
                      {t(
                        user.googleLinked
                          ? 'pages.account.unlink_account'
                          : 'pages.account.link_account'
                      ).replace('{{ name }}', 'Google')}
                    </ListItemText>
                  </ListItemButton>

                  {/* Un/link Github */}
                  <ListItemButton
                    onClick={() => (user.githubLinked ? unlink('github') : link('github'))}
                  >
                    <ListItemIcon>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText>
                      {t(
                        user.githubLinked
                          ? 'pages.account.unlink_account'
                          : 'pages.account.link_account'
                      ).replace('{{ name }}', 'Github')}
                    </ListItemText>
                  </ListItemButton>

                  {/* Change Name */}
                  <ListItemButton onClick={changeName}>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText>{t('pages.account.change_name')}</ListItemText>
                  </ListItemButton>

                  {/* Change Email Address */}
                  <ListItemButton onClick={changeEmailAddress}>
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                    <ListItemText>{t('pages.account.change_email_address')}</ListItemText>
                  </ListItemButton>

                  {/* Login Info */}
                  <ListItem>
                    <ListItemIcon>
                      <LockClock />
                    </ListItemIcon>
                    <ListItemText
                      secondary={t('pages.account.last_signin')}
                      primary={
                        readableDate(user.metadata.lastSignInTime) +
                        ' ' +
                        readableTime(user.metadata.lastSignInTime)
                      }
                    />
                  </ListItem>
                </List>
              </SideCard>
            </Grid>
          </Grid>
        </Container>
      )}
      <style jsx>{`
        .profile-image {
          flex: none;
          width: 82px;
          height: 82px;
          line-height: 82px;
          border-radius: 50%;
          background: #ececec;
          border: 1px solid #d8d8d8;
          font-size: 32px;
          color: #000;
          text-align: center;
          margin: 10px 0;
          display: inline-block;
          pointer-events: none;
        }
        .api-key {
          display: inline-block;
          color: #2563eb;
          background: #eff6ff;
          line-height: 1.2;
          overflow-wrap: anywhere;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
};

interface SideCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SideCard = ({ children, title, description }: SideCardProps) => {
  const t = useTranslate();

  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Typography fontSize="1.25rem" fontWeight={500} mb={description ? 0 : 2}>
        {t(title)}
      </Typography>
      {description && (
        <Typography fontSize="1rem" color="gray" mb={2}>
          {t(description)}
        </Typography>
      )}
      {children}
    </Card>
  );
};

export default AccountPage;
