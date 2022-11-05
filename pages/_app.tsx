import { createContext, useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import DrawerLayout from '../components/navigation/drawer-layout';
import theme from '../lib/theme';
import { UserLanguageProvider } from '../i18n/i18n';
import TOAAppContext from '../lib/models/AppContext';
import { fetchAppData, useAppData } from '../lib/page-helpers/app-helper';

const Context = createContext<TOAAppContext>({} as TOAAppContext);
export const useAppContext = () => useContext(Context);

function MyApp({
  Component,
  pageProps
}: AppProps<{ initialState: TOAAppContext; userLanguage: string }>) {
  const initialState = useAppData(pageProps.initialState);

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
          <Context.Provider value={initialState}>
            <CssBaseline />
            <DrawerLayout title="The Orange Alliance">
              <Component {...pageProps} />
            </DrawerLayout>
            <Toaster />
          </Context.Provider>
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
  const toaAppProps = await fetchAppData();

  return {
    ...appProps,
    pageProps: {
      userLanguage: appContext.ctx.query.userLanguage || 'en',
      initialState: toaAppProps
    }
  };
};

export default MyApp;
