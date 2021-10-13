const expirationTime = 3155695200000 // 100 years

const updateNotificationState = (notificationId, wasShown) => {
  if (document == null) {
    return;
  }

  if (wasShown) {
    const date = new Date();
    date.setTime(date.getTime() + expirationTime)
    document.cookie = `${notificationId}=1; expires=${date.toUTCString()}; path=/`
  } else {
    document.cookie = `${notificationId}=0; expires=-1; path=/`
  }
};

export default updateNotificationState;
