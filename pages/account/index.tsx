import { NextPage } from 'next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  logout,
  linkProvider,
  unlinkProvider,
  sendPasswordReset,
  changeDisplayName,
  changeEmail,
  cloudMessaging
} from '../../providers/FirebaseProvider';
import { useEffect, useState } from 'react';
import TOAUser from '../../lib/TOAUser';
import TOAProvider from '../../providers/TOAProvider';
import { Team, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import SimpleTeamPaper from '../../components/SimpleTeamPaper';
import NextLink from 'next/link';
import { GitHub, Google, Lock, LockClock, NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { readableDate, readableTime } from '../../lib/utils/common';
import { toast } from 'react-hot-toast';
import SEO from '../../components/seo';
import { useAppContext } from '../../lib/toa-context';

const AccountPage: NextPage = () => {
  const router = useRouter();
  const t = useTranslate();

  const { user, setUser, regions } = useAppContext();
  const [events, setEvents] = useState<Event[]>();
  const [teams, setTeams] = useState<Team[]>();
  const [notiEnabled, setNotiEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Get Teams
      const teamPromises = user.favoriteTeams.map(t => TOAProvider.getAPI().getTeam(t));
      Promise.all(teamPromises)
        .then(teams => setTeams(teams))
        .catch(() => { });

      // Get Events
      const eventPromises = user.favoriteEvents.map(e => TOAProvider.getAPI().getEvent(e));
      Promise.all(eventPromises)
        .then(events => setEvents(events))
        .catch(() => {
          toast.error(t('general.error_occurred'));
        });
    }
  }, [user]);

  useEffect(() => {
    // Check if notifications are enabled
    cloudMessaging.tokenInlocalforage().then(token => {
      if (token) {
        setNotiEnabled(true);
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
      toast.error(t('general.error_occurred'));
      return;
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

  const enableNotifications = () => {
    cloudMessaging.init().then(() => {
      setNotiEnabled(true);
      toast.success(t('pages.account.notifications_card.enabled'));
    }).catch(() => {
      toast.error(t('general.error_occurred') + ". " + t("pages.account.notifications_card.help"));
    });
  };

  const disableNotifications = () => {
    cloudMessaging.disable().then(() => {
      setNotiEnabled(false);
      toast.success(t('pages.account.notifications_card.blocked'));
    }).catch(() => {
      toast.error(t('general.error_occurred'));
    });
  };

  return (
    <>
      <SEO title="Account Overview" description="Overview of your TOA account." url="/account" />

      {/* Header/Name Card */}
      <Card sx={{ margin: 2 }}>
        {!user && <LinearProgress />}
        {user && (
          <CardContent>
            <Box>
              <Grid container direction={'row'}>
                <Grid item xs={1}>
                  {user.photoURL && (
                    <img
                      className={'profile-image'}
                      src={user.photoURL}
                      alt={'user profile photo'}
                    />
                  )}
                </Grid>
                <Grid item alignSelf={'end'} sx={{ margin: 2 }} xs={9}>
                  <Typography variant={'h4'}>{user.displayName || 'User'}</Typography>
                  {regions && <Typography>{user.summary(regions)}</Typography>}
                </Grid>
                <Grid item xs={1} sx={{ margin: 2 }}>
                  <Button variant={'contained'} onClick={doLogoutUser}>
                    {t('pages.account.logout')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        )}
      </Card>


      {/* Main Content */}
      {user && (
        <Grid container direction={'row'} spacing={2}>

          {/* Left Column */}
          <Grid item md={8} xs={12}>

            {/* Favorite Teams/Events */}
            <Card sx={{ margin: 2, marginRight: { xs: 2, md: 0 } }}>
              <CardContent>
                <Grid container direction={'row'} spacing={2} style={{ width: '100%' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ marginLeft: 1 }} variant={'h6'}>
                      {t('general.teams')}
                    </Typography>
                    {teams && teams.length < 1 && (
                      <Typography sx={{ marginLeft: 2 }} variant={'subtitle2'}>
                        {t('no_data.teams')}
                      </Typography>
                    )}
                    <List sx={{ paddingTop: 0 }}>
                      {teams &&
                        teams.map(t => (
                          <ListItem key={t.teamKey} sx={{ paddingLeft: 0 }}>
                            <SimpleTeamPaper team={t} />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={{ marginLeft: 1 }} variant={'h6'}>
                      {t('general.events')}
                    </Typography>
                    {events && events.length < 1 && (
                      <Typography sx={{ marginLeft: 2 }} variant={'subtitle2'}>
                        {t('no_data.teams')}
                      </Typography>
                    )}
                    <List sx={{ paddingTop: 0 }}>
                      {events &&
                        events.map(e => (
                          <ListItem key={e.eventKey} sx={{ paddingLeft: 0 }}>
                            <SimpleEventPaper event={e} />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item md={4} xs={12}>

            {/* Notifications */}
            {(
              <SideCard title="pages.account.notifications_card.title">
                <Typography variant='body2' sx={{mb: 2}}>
                  {t('pages.account.notifications_card.summary')}
                </Typography>
                {notiEnabled ? <NotificationsActive sx={{mb: '-7px'}} /> : <NotificationsOff sx={{mb: '-7px'}} />}
                <Typography variant='body1' sx={{display: "inline"}}>
                  {t(notiEnabled ? 'pages.account.notifications_card.enabled' : 'pages.account.notifications_card.blocked')}
                </Typography>
                {!notiEnabled &&
                  <Button variant="contained" fullWidth onClick={enableNotifications}>{t("pages.account.notifications_card.grant_access")}</Button>
                }
                {notiEnabled &&
                  <Button variant="contained" fullWidth onClick={disableNotifications}>{t("pages.account.notifications_card.revoke_access")}</Button>
                }
              </SideCard>
            )}

            {/* API Key */}
            <SideCard title="pages.account.api_card.title">
              <Grid container direction={'row'}>

                {/* Left Main Content */}
                <Grid item xs={9} zeroMinWidth>
                  {/* API Key Generated */}
                  {user.apiKey && (
                    <>
                      <Typography sx={{ marginTop: 2 }} variant={'subtitle1'}>
                        {t('pages.account.api_card.your_key')}
                      </Typography>
                      <code style={{ overflowWrap: 'break-word', color: 'red' }}>
                        {user.apiKey || 'Not found'}
                      </code>
                    </>
                  )}

                  {/* API Key Generating */}
                  {!user.apiKey && user.emailVerified && (
                    <>
                      <Typography variant={'subtitle1'}>
                        <CircularProgress size={30} />
                        {t('pages.account.api_card.generating_key')}
                      </Typography>
                    </>
                  )}

                  {/* API Key Not Generated, user email not verified */}
                  {!user.apiKey && !user.emailVerified && (
                    <>
                      <Typography variant={'subtitle1'}>
                        {t('pages.account.no_verify')}
                      </Typography>
                    </>
                  )}

                  {/* API Docs */}
                  <Typography sx={{ marginTop: 2 }} variant={'subtitle1'}>
                    {t('pages.account.api_card.docs') + ' '}
                    <NextLink href="/apidocs">
                      <a>{t('general.here')}</a>
                    </NextLink>
                    .
                  </Typography>
                </Grid>

                {/* Right Image */}
                <Grid item xs={3}>
                  <img src="/imgs/api-icon.svg" />
                </Grid>
              </Grid>
            </SideCard>

            {/* Account Settings */}
            <SideCard title="pages.account.account_settings">
              <List>
                {/* Reset Password */}
                <ListItem button onClick={reset}>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText>{t('pages.account.reset_password')}</ListItemText>
                </ListItem>

                {/* Un/link Google */}
                <ListItem
                  button
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
                </ListItem>

                {/* Un/link Github */}
                <ListItem
                  button
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
                </ListItem>

                {/* Change Name */}
                <ListItem button onClick={changeName}>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText>{t('pages.account.change_name')}</ListItemText>
                </ListItem>

                {/* Change Email Address */}
                <ListItem button onClick={changeEmailAddress}>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText>{t('pages.account.change_email_address')}</ListItemText>
                </ListItem>

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
      `}</style>
    </>
  );
};

interface SideCardProps {
  title: string;
  children: React.ReactNode;
}

const SideCard = ({ children, title }: SideCardProps) => {

  const t = useTranslate();

  return (
    <Card sx={{ margin: 2, marginLeft: { xs: 2, md: 0 }, marginTop: { xs: 0, md: 2 } }}>
      <CardContent>
        <Typography variant={'h5'}>
          {t(title)}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}

export default AccountPage;
