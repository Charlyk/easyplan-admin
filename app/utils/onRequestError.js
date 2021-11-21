import { useContext } from 'react';
import NotificationsContext from 'app/context/notificationsContext';

const onRequestError = (error) => {
  const toast = useContext(NotificationsContext);
  if (error.response != null) {
    const { data } = error.response;
    toast?.error(data.message || error.message);
  } else {
    toast?.error(error.message);
  }
};

export default onRequestError;
