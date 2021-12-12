import { NotificationsProviderValue } from 'app/context/NotificationsProvider';

const onRequestError = (error: any, toast: NotificationsProviderValue) => {
  if (error.response != null) {
    const { data } = error.response;
    toast?.error(data.message || error.message);
  } else {
    toast?.error(error.message);
  }
};

export default onRequestError;
