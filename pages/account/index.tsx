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
  isLoggedIn,
  getAuthInstance,
  logout,
  inStartupState,
  linkProvider,
  unlinkProvider,
  sendPasswordReset,
  fetchUserData,
  changeDisplayName,
  changeEmail
} from '../../providers/FirebaseProvider';
import { useEffect, useState } from 'react';
import TOAUser from '../../lib/TOAUser';
import TOAProvider from '../../providers/TOAProvider';
import { Region, Team, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import SimpleTeamPaper from '../../components/SimpleTeamPaper';
import NextLink from 'next/link';
import { GitHub, Google, Lock, LockClock, Password } from '@mui/icons-material';
import { readableDate, readableTime } from '../../lib/utils/common';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import SEO from '../../components/seo';

const AccountPage: NextPage = () => {
  const router = useRouter();
  const t = useTranslate();

  const [toaUser, setToaUser] = useState<TOAUser>();
  const [regions, setRegions] = useState<Region[]>();
  const [events, setEvents] = useState<Event[]>();
  const [teams, setTeams] = useState<Team[]>();

  useEffect(() => {
    if (inStartupState() || !isLoggedIn()) {
      onAuthStateChanged(getAuthInstance(), user => {
        if (!user) {
          router.push({ pathname: '/account/login' });
        } else {
          initPage();
        }
      });
    } else {
      initPage();
    }
  }, []);

  const initPage = () => {
    // Get Data from Firebase
    fetchUserData()
      .then(user => {
        // Set User Data
        setToaUser(user);

        // Get Teams
        const teamPromises = user.favoriteTeams.map(t => TOAProvider.getAPI().getTeam(t));
        Promise.all(teamPromises)
          .then(teams => setTeams(teams))
          .catch(() => {});

        // Get Events
        const eventPromises = user.favoriteEvents.map(e => TOAProvider.getAPI().getEvent(e));
        Promise.all(eventPromises)
          .then(events => setEvents(events))
          .catch(() => {
            toast.error(t('general.error_occurred'));
          });
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });

    // Get Regions
    TOAProvider.getAPI()
      .getRegions()
      .then(r => setRegions(r))
      .catch(() => {
        toast.error(t('general.error_occurred'));
      });
  };

  const doLogoutUser = () => {
    logout().then(() => {
      router.push({ pathname: '/account/login' });
    });
  };

  const unlink = (provider: 'github' | 'google') => {
    unlinkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(toaUser?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = false;
            break;
          case 'google':
            newUser.googleLinked = false;
            break;
        }
        setToaUser(newUser);
      })
      .catch(() => {
        toast.error('general.error_occurred');
      });
  };

  const link = (provider: 'github' | 'google') => {
    linkProvider(provider)
      .then(() => {
        const newUser = new TOAUser().fromJSON(toaUser?.toJSON());
        switch (provider) {
          case 'github':
            newUser.githubLinked = true;
            break;
          case 'google':
            newUser.googleLinked = true;
            break;
        }
        setToaUser(newUser);
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
    const newUser = new TOAUser().fromJSON(toaUser?.toJSON());
    newUser.displayName = name;
    setToaUser(newUser);
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
      const newUser = new TOAUser().fromJSON(toaUser?.toJSON());
      newUser.email = email;
      setToaUser(newUser);
      toast.success(t('account.updated_email'));
    } else {
      toast.error(t('account.fail_update_email'));
    }
  };

  return (
    <>
      <SEO title="Account Overview" description="Overview of your TOA account." url="/account" />

      <Card sx={{ margin: 2 }}>
        {!toaUser && <LinearProgress />}
        {toaUser && (
          <CardContent>
            <Box>
              <Grid container direction={'row'}>
                <Grid item xs={1}>
                  {toaUser.photoURL && (
                    <img
                      className={'profile-image'}
                      src={toaUser.photoURL}
                      alt={'user profile photo'}
                    />
                  )}
                </Grid>
                <Grid item alignSelf={'end'} sx={{ margin: 2 }} xs={9}>
                  <Typography variant={'h4'}>{toaUser.displayName || 'User'}</Typography>
                  {regions && <Typography>{toaUser.summary(regions)}</Typography>}
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

      {toaUser && (
        <Grid container direction={'row'} spacing={2}>
          {/* Main Content */}
          <Grid item md={8} xs={12}>
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

          {/* Right Sidebar */}
          <Grid item md={4} xs={12}>
            {/* Notifications */}
            {false && (
              <Card sx={{ margin: 2, marginLeft: { xs: 2, md: 0 }, marginTop: { xs: 0, md: 2 } }}>
                <CardContent>Notifications!</CardContent>
              </Card>
            )}

            {/* API Key */}
            <Card sx={{ margin: 2, marginLeft: { xs: 2, md: 0 }, marginTop: { xs: 0, md: 2 } }}>
              <CardContent>
                <Grid container direction={'row'}>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography sx={{ marginTop: 2 }} variant={'h5'}>
                      {t('pages.account.api_card.title')}
                    </Typography>
                    {toaUser.apiKey && (
                      <>
                        <Typography sx={{ marginTop: 2 }} variant={'subtitle1'}>
                          {t('pages.account.api_card.your_key')}
                        </Typography>
                        <code style={{ overflowWrap: 'break-word', color: 'red' }}>
                          {toaUser.apiKey || 'Not found'}
                        </code>
                      </>
                    )}
                    {!toaUser.apiKey && toaUser.emailVerified && (
                      <>
                        <Typography variant={'subtitle1'}>
                          <CircularProgress size={30} />
                          {t('pages.account.api_card.generating_key')}
                        </Typography>
                      </>
                    )}
                    {!toaUser.apiKey && !toaUser.emailVerified && (
                      <>
                        <Typography variant={'subtitle1'}>
                          {t('pages.account.no_verify')}
                        </Typography>
                      </>
                    )}
                    <Typography sx={{ marginTop: 2 }} variant={'subtitle1'}>
                      {t('pages.account.api_card.docs') + ' '}
                      <NextLink href="/apidocs">
                        <a>{t('general.here')}</a>
                      </NextLink>
                      .
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <img src="/imgs/api-icon.svg" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card sx={{ margin: 2, marginLeft: { xs: 2, md: 0 }, marginTop: { xs: 0, md: 2 } }}>
              <CardContent>
                <Typography sx={{ marginTop: 2 }} variant={'h5'}>
                  {t('pages.account.account_settings')}
                </Typography>
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
                    onClick={() => (toaUser.googleLinked ? unlink('google') : link('google'))}
                  >
                    <ListItemIcon>
                      <Google />
                    </ListItemIcon>
                    <ListItemText>
                      {t(
                        toaUser.googleLinked
                          ? 'pages.account.unlink_account'
                          : 'pages.account.link_account'
                      ).replace('{{ name }}', 'Google')}
                    </ListItemText>
                  </ListItem>

                  {/* Un/link Github */}
                  <ListItem
                    button
                    onClick={() => (toaUser.githubLinked ? unlink('github') : link('github'))}
                  >
                    <ListItemIcon>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText>
                      {t(
                        toaUser.githubLinked
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
                        readableDate(toaUser.metadata.lastSignInTime) +
                        ' ' +
                        readableTime(toaUser.metadata.lastSignInTime)
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
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
export default AccountPage;
