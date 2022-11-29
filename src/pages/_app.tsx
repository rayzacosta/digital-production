import '../styles/globals.css';
import 'src/styles/styles.scss';

import type { AppProps } from 'next/app';
import { userService } from 'src/services';
import { Nav } from 'src/components';
import { ThemeProvider } from 'react-bootstrap';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NavMobile } from 'src/components/NavMobile';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/pt-br';

const DEFAULT_TOAST_PROPS: ToastContainerProps = {
  position: 'bottom-right',
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const isMobileLayout = router.pathname.startsWith('/mobile');

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login'];
    const path = url.split('?')[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Digital Production</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
      </Head>
      <ThemeProvider>
        <div className="app-container bg-light min-vh-100">
          {isMobileLayout ? <NavMobile /> : <Nav />}
          <div className="container pt-4 pb-4">
            {authorized && (
              <div>
                <Component {...pageProps} />
              </div>
            )}
          </div>
        </div>
        <ToastContainer {...DEFAULT_TOAST_PROPS} />
      </ThemeProvider>
    </>
  );
}
