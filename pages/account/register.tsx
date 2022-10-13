import { NextPage } from 'next';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useTranslate } from '../../i18n/i18n';
import { useState } from 'react';
import { signUp } from '../../providers/FirebaseProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const LoginPage: NextPage = () => {
  const t = useTranslate();
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [team, setTeam] = useState<string>('');

  const doSignUp = () => {
    if (!fullName || fullName.trim().length < 4) {
      // snackbar.open('You forgot to type your FULL NAME.');
    } else if (password !== confirmPassword) {
      // snackbar.open(`Those passwords didn't match. Try again.`);
    } else {
      signUp(email, fullName, password, team)
        .then(() => {
          toast.success(t('pages.account.subpages.register.success'));
          return router.push({ pathname: '/account' });
        })
        .catch(() => {
          toast.success(t('general.error_occurred'));
        });
    }
  };

  const postLoginSuccess = () => {
    router.push({ pathname: '/account' });
  };

  return (
    <>
      <Grid container direction={'column'} alignContent={'center'}>
        <Grid item sx={{ marginTop: 7 }}>
          <Card>
            <CardContent>
              <Typography variant={'h4'}>{t('pages.account.subpages.register.title')}</Typography>
              <Grid container direction={'column'} sx={{ marginTop: 0, width: 400 }} spacing={2}>
                <Grid item>
                  <TextField
                    type={'text'}
                    variant={'outlined'}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.register.full_name')}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type={'email'}
                    variant={'outlined'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.login.email')}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type={'password'}
                    variant={'outlined'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.register.password')}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type={'password'}
                    variant={'outlined'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.register.confirm_password')}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type={'text'}
                    variant={'outlined'}
                    value={team}
                    onChange={e => setTeam(e.target.value)}
                    fullWidth
                    label={t('pages.account.subpages.register.your_team')}
                  />
                </Grid>
                <Grid item>
                  <Button fullWidth variant={'contained'} onClick={doSignUp}>
                    {t('pages.account.subpages.register.sign_up')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
