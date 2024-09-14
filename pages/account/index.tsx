import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { logout } from '@/providers/firebase-provider';
import { useTranslate } from '@/i18n/i18n';
import SEO from '@/components/seo';
import { useAppContext } from '@/lib/toa-context';
import AccountSettingsCard from '@/components/pages/account/AccountSettingsCard';
import APICard from '@/components/pages/account/APICard';
import NotificationsCard from '@/components/pages/account/NotificationsCard';
import FavoritesCard from '@/components/pages/account/FavoritesCard';

const AccountPage: NextPage = () => {
  const router = useRouter();
  const t = useTranslate();

  const { user, setUser } = useAppContext();

  const doLogoutUser = () => {
    logout().then(() => {
      setUser(null);
      router.push({ pathname: '/account/login' });
    });
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
            <Grid item lg={7} md={12}>
              {/* Favorite Teams/Events */}
              <FavoritesCard />
            </Grid>

            {/* Right Column */}
            <Grid item lg={5} md={12}>
              {/* Notifications */}
              <NotificationsCard />

              {/* API Key */}
              <APICard />

              {/* Account Settings */}
              <AccountSettingsCard />
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
      `}</style>
    </>
  );
};

export default AccountPage;
