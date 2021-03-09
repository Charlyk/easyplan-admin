import React, { useMemo } from "react";
import { PubNubProvider } from "pubnub-react";
import { wrapper } from "../store";
import authManager from "../utils/settings/authManager";
import AppComponent from '../src/App';
import PubNub from "pubnub";
import NextNprogress from 'nextjs-progressbar';
import axios from "axios";
import { baseAppUrl } from "../eas.config";
import { handleRequestError } from "../utils/helperFuncs";
import App from "next/app";
import { parseCookies } from "../api/utils";
import Head from 'next/head';
import paths from "../utils/paths";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss'

const pubnub = new PubNub({
  publishKey: 'pub-c-feea66ec-303f-476d-87ec-0ed7f6379565',
  subscribeKey: 'sub-c-6cdb4ab0-32f2-11eb-8e02-129fdf4b0d84',
  uuid: authManager.getUserId() || PubNub.generateUUID(),
});

function NextApp({ Component, pageProps }) {
  const router = useRouter();
  const { currentClinic } = pageProps;

  const getPageTitle = () => {
    return paths[router.pathname];
  };

  const clinicName = useMemo(() => {
    return currentClinic?.clinicName || 'EasyPlan'
  }, [currentClinic]);

  return (
    <>
      <Head>
        <title>{`${clinicName} - ${getPageTitle()}`}</title>
      </Head>
      <PubNubProvider client={pubnub}>
        <AppComponent>
          <NextNprogress
            color="#29D"
            startPosition={0.3}
            height="3"
          />
          <Component {...pageProps} />
        </AppComponent>
      </PubNubProvider>
    </>
  );
}

NextApp.getInitialProps = async (appContext) => {
  const { req, res } = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  try {
    const { auth_token } = parseCookies(req)
    if (auth_token == null) {
      await handleRequestError({ response: { status: 401, statusText: '' } }, req, res)
      return appProps;
    }
    const { data: currentUser } = await axios.get(`${baseAppUrl}/api/auth/me`, {
      headers: req.headers
    });
    const { data: currentClinic } = await axios.get(`${baseAppUrl}/api/clinic/details`, {
      headers: req.headers
    });
    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        currentUser,
        currentClinic,
      }
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return appProps;
  }
}

export default wrapper.withRedux(NextApp)
