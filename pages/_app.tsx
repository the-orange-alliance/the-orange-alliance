import { useState, useEffect, useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  ThemeProvider
} from '@mui/material';
import DrawerLayout from '@/components/navigation/drawer-layout';
import theme from '@/lib/theme';
import { UserLanguageProvider } from '@/i18n/i18n';
import { fetchAppData, IRawAppProps, useAppData } from '@/lib/page-helpers/app-helper';
import TOAAppContextProvider, { IAppContext } from '@/lib/toa-context';
import TOAUser from '@/lib/models/toa-user';
import { onAuthStateChanged } from 'firebase/auth';
import { cloudMessaging, fetchUserData, getAuthInstance } from '@/providers/firebase-provider';

let toaGlobalData: IRawAppProps | null = null;

function MyApp({
  Component,
  pageProps
}: AppProps<{ initialState: IAppContext; userLanguage: string }>) {
  const globals = useAppData(pageProps.initialState);
  const [user, setUser] = useState<TOAUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const authedUserId = useRef<string | null>(null);
  const value = useMemo(
    () => ({ ...globals, isAuthLoaded, user, setUser }),
    [user, setUser, isAuthLoaded] // eslint-disable-line react-hooks/exhaustive-deps
  );

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
      if (newUser && newUser.uid !== authedUserId.current && newUser.uid !== user?.uid) {
        authedUserId.current = newUser.uid;
        fetchUserData().then(user => {
          setUser(user);
          setIsAuthLoaded(true);
        });
      } else if (user && !newUser) {
        // prevent repetative null sets
        setUser(null);
        setIsAuthLoaded(true);
      } else {
        setIsAuthLoaded(true);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            {/* <AnalyticsScript /> */}
          </TOAAppContextProvider>
        </ThemeProvider>
      </UserLanguageProvider>
      <style jsx global>{`
        :root {
          --toa-navbar-height: 56px;
          --toa-colors-red: #f44336;
          --toa-colors-red-transparent: rgba(244, 67, 54, 0.12);
          --toa-colors-blue: #2196f3;
          --toa-colors-blue-transparent: rgba(33, 150, 243, 0.12);
          --toa-colors-tie: #aa00ff;
          --toa-colors-tie-transparent: rgba(170, 0, 255, 0.12);
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
        html,
        body {
          scroll-padding-top: var(--toa-navbar-height);
          scroll-behavior: smooth;
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
