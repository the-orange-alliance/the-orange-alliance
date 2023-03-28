import { NextPage } from 'next';
import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { useTranslate } from '../../i18n/i18n';
import { useState } from 'react';
import { signUp } from '../../providers/FirebaseProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import SEO from '../../components/seo';

const LoginPage: NextPage = () => {
  const t = useTranslate();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = () => {
    if (!fullName || fullName.trim().length < 4) {
      toast.error('You forgot to type your FULL NAME.');
    } else if (password !== confirmPassword) {
      toast.error(`Those passwords didn't match. Try again.`);
    } else {
      setIsLoading(true);
      signUp(email, fullName, password)
        .then(() => {
          toast.success(t('pages.account.subpages.register.success'));
          router.push({ pathname: '/account' });
        })
        .catch(err => {
          console.log(err);
          toast.error(t('general.error_occurred'));
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <SEO title="Sign up" url="/account/register" />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Card sx={{ width: 400 }}>
          <CardContent>
            <Typography variant="h4" mb={2}>
              {t('pages.account.subpages.register.title')}
            </Typography>
            <Stack spacing={1}>
              <TextField
                type="text"
                variant="outlined"
                autoComplete="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                fullWidth
                label={t('pages.account.subpages.register.full_name')}
              />
              <TextField
                type="email"
                variant="outlined"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                label={t('pages.account.subpages.login.email')}
              />
              <TextField
                type="password"
                variant="outlined"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                label={t('pages.account.subpages.register.password')}
              />
              <TextField
                type="password"
                variant="outlined"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                fullWidth
                label={t('pages.account.subpages.register.confirm_password')}
              />
              <Button fullWidth variant="contained" onClick={handleSignUp} disabled={isLoading}>
                {isLoading ? t('general.loading') : t('pages.account.subpages.register.sign_up')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
