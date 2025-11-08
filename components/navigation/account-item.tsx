import NextLink from 'next/link';
import { Avatar, Box, Button, ButtonBase, Skeleton, Stack, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';

const initials = (name: string) => {
  const [firstName, lastName] = name.split(' ');
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
};

const AccountItem = () => {
  const { user, isAuthLoaded } = useAppContext();
  const theme = useTheme();
  const t = useTranslate();

  return (
    <>
      {!isAuthLoaded ? (
        <Skeleton
          variant="rounded"
          height={48}
          sx={{
            mx: 1,
            my: 1.5
          }}
        />
      ) : !user ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            pt: 2,
            px: 2,
            mx: 1,
            mt: 0.5,
            marginBottom: 0,
            paddingBottom: 0.5,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          {/* <Box sx={{ mr: 3 }}>{icon}</Box> */}

          <Grid container direction="column" justifyContent="center">
            <Grid>{t('drawer.mytoa.hello').replace('{{ name }}', t('drawer.mytoa.guest'))}</Grid>
            <Grid>
              <Grid container direction="row" spacing={1} alignItems="center">
                <Grid>
                  <NextLink href="/account/login" passHref legacyBehavior>
                    <Button size="small">{t('drawer.mytoa.login')}</Button>
                  </NextLink>
                </Grid>
                <Grid>
                  <NextLink href="/account/register" passHref legacyBehavior>
                    <Button size="small">{t('drawer.mytoa.register')}</Button>
                  </NextLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <NextLink href="/account" passHref legacyBehavior>
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
