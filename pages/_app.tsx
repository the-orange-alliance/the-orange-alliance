import '../styles/globals.css';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/local.scss';
import theme from '../lib/theme';
import { useEffect } from 'react';
import { UserLanguageProvider } from '../i18n/i18n';
import App from 'next/app';
import AppDrawer from '../components/AppDrawer';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>The Orange Alliance</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <UserLanguageProvider defaultUserLanguage={pageProps.userLanguage}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppDrawer title={'The Orange Alliance'} content={<Component {...pageProps} />} />
        </ThemeProvider>
      </UserLanguageProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    pageProps: {
      userLanguage: appContext.ctx.query.userLanguage || 'en'
    }
  };
};

export default MyApp;
