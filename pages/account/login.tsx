import { NextPage } from 'next';
import { Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import { useTranslate } from '@/i18n/i18n';
import { GitHub, Google } from '@mui/icons-material';
import { useState } from 'react';
import {
  fetchUserData,
  loginWithEmailAndPassword,
  loginWithGithub,
  loginWithGoogle
} from '@/providers/firebase-provider';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import SEO from '@/components/seo';
import { useAppContext } from '@/lib/toa-context';

const LoginPage: NextPage = () => {
  const t = useTranslate();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useAppContext();

  const loginEmail = () => {
    loginWithEmailAndPassword(email, password)
      .then(() => {
        postLoginSuccess();
      })
      .catch(() => {
        toast.error(t('pages.account.subpages.login.invalid_login'));
      });
  };

  const loginGoogle = () => {
    loginWithGoogle()
      .then(() => {
        postLoginSuccess();
      })
      .catch(() => {
        toast.error(t('pages.account.subpages.login.no_account_linked'));
      });
  };

  const loginGithub = () => {
    loginWithGithub()
      .then(() => {
        postLoginSuccess();
      })
      .catch(() => {
        toast.error(t('pages.account.subpages.login.no_account_linked'));
      });
  };

  const postLoginSuccess = () => {
    // Get redirect URL from local storage
    const redirect = localStorage.getItem('redirect');
    let goTo = '/account';
    // If we were on an event page or a team page, redirect back there
    if (
      redirect &&
      typeof redirect === 'string' &&
      (redirect.startsWith('/events') || redirect.startsWith('/teams'))
    )
      goTo = redirect;
    // Redirect
    router.push({ pathname: goTo });
    // Fetch the user data
    fetchUserData()
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        toast.error(t('general.error_occurred'));
        // If we were on any page, redirect back there
        if (goTo === '/account' && redirect) router.push({ pathname: redirect });
        else router.push({ pathname: '/' });
      });
    // Clear redirect URL from local storage
    localStorage.removeItem('redirect');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      loginEmail();
    }
  };

  return (
    <>
      <SEO title="Sign in" url="/account/login" />
      <Grid container direction="column" alignContent="center">
        <Grid sx={{ marginTop: 7 }}>
          <Card onKeyPress={handleKeyPress}>
            <CardContent>
              <Typography variant="h4">{t('pages.account.subpages.login.title')}</Typography>
              <Grid container direction="column" sx={{ marginTop: 0, width: 400 }} spacing={2}>
                <Grid>
                  <TextField
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.login.title')}
                  />
                </Grid>
                <Grid>
                  <TextField
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    fullWidth
                    label={t('pages.account.subpages.login.password')}
                  />
                </Grid>
                <Grid>
                  <Button fullWidth variant="contained" onClick={loginEmail}>
                    {t('pages.account.subpages.login.login')}
                  </Button>
                </Grid>
                <Grid>
                  <Grid container direction="row" spacing={2}>
                    <Grid size={6}>
                      <button className="login-with-button" onClick={loginGoogle}>
                        <Google />
                        {t('pages.account.subpages.login.login_google')}
                      </button>
                    </Grid>
                    <Grid size={6}>
                      <button className="login-with-button" onClick={loginGithub}>
                        <GitHub />
                        {t('pages.account.subpages.login.login_github')}
                      </button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <style jsx>{`
        .login-with-button {
          font-size: 14px;
          line-height: 1.2;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #999;
          background-color: #fff;
          transition: all 0.4s;
          margin-bottom: 10px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
        }

        .login-with-button:hover {
          border-color: orange;
        }
      `}</style>
    </>
  );
};

export default LoginPage;
