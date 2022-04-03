import { useCallback, useEffect } from 'react';
import {
  getAnalytics,
  logEvent as logAnalyticsEvent,
  Analytics,
} from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { AnalyticsEvent } from 'types';

let firebaseAnalytics: Analytics;

const firebaseConfig = {
  apiKey: 'AIzaSyAos5cIaXScXTGQ0QtmW1MOY8CncLp9Lbc',
  authDomain: 'easyplan-pro.firebaseapp.com',
  projectId: 'easyplan-pro',
  storageBucket: 'easyplan-pro.appspot.com',
  messagingSenderId: '537787293937',
  appId: '1:537787293937:web:cab22ea6af2036ab3e4950',
  measurementId: 'G-GDQJ2JHL9J',
};

type Event = {
  event: AnalyticsEvent;
  payload: any;
};

const useAnalytics = () => {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  const initFirebaseAnalytics = (): Analytics => {
    if (!firebaseAnalytics) {
      const app = initializeApp(firebaseConfig);
      firebaseAnalytics = getAnalytics(app);
    }

    return firebaseAnalytics;
  };

  const logEvent = useCallback(
    (event: Event) => {
      if (!firebaseAnalytics) {
        initFirebaseAnalytics();
      }
      logAnalyticsEvent(firebaseAnalytics, event.event, event.payload);
    },
    [firebaseAnalytics],
  );

  return [logEvent];
};

export default useAnalytics;
