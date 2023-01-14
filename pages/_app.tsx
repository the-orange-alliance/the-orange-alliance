import { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import DrawerLayout from '../components/navigation/drawer-layout';
import theme from '../lib/theme';
import { UserLanguageProvider } from '../i18n/i18n';
import TOAAppContext from '../lib/models/AppContext';
import { fetchAppData, IRawAppProps, useAppData } from '../lib/page-helpers/app-helper';
import TOAAppContextProvider from '../lib/toa-context';
import TOAUser from '../lib/TOAUser';
import { onAuthStateChanged } from 'firebase/auth';
import { cloudMessaging, fetchUserData, getAuthInstance } from '../providers/FirebaseProvider';

let toaGlobalData: IRawAppProps | null = null;

function MyApp({
  Component,
  pageProps
}: AppProps<{ initialState: TOAAppContext; userLanguage: string }>) {
  const globals = useAppData(pageProps.initialState);
  const [user, setUser] = useState<TOAUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const value = useMemo(() => ({ ...globals, isAuthLoaded, user, setUser }), [user, setUser]);
  let currUid: string = '';

  useEffect(() => {
    // Register onMessage event
    cloudMessaging.onMessage();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // Register Authentication listener
    onAuthStateChanged(getAuthInstance(), newUser => {
      // Only requery data if UID has changed
      if (newUser && newUser.uid !== currUid && newUser.uid !== user?.uid) {
        currUid = newUser.uid;
        fetchUserData().then(user => {
          setUser(user);
          setIsAuthLoaded(true);
        });
      } else if (user && !newUser) {
        // prevent repetative null sets
        setUser(null);
        setIsAuthLoaded(true);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <UserLanguageProvider defaultUserLanguage={pageProps.userLanguage}>
        <ThemeProvider theme={theme}>
          <TOAAppContextProvider value={value}>
            <CssBaseline />
            <DrawerLayout title="The Orange Alliance">
              <Component {...pageProps} />
            </DrawerLayout>
            <Toaster />
          </TOAAppContextProvider>
        </ThemeProvider>
      </UserLanguageProvider>
      <style jsx global>{`
        :root {
          --toa-navbar-height: 56px;
        }
        @media (min-width: 0px) and (orientation: landscape) {
          :root {
            --toa-navbar-height: 48px;
          }
        }
        @media (min-width: 600px) {
          :root {
            --toa-navbar-height: 64px;
          }
        }
      `}</style>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  if (!toaGlobalData) {
    toaGlobalData = await fetchAppData();
  }

  return {
    ...appProps,
    pageProps: {
      userLanguage: appContext.ctx.query.userLanguage || 'en',
      initialState: toaGlobalData
    }
  };
};

export default MyApp;
