const wasNotificationShown = (notificationId) => {
  if (document == null) {
    return true;
  }
  const nameEQ = notificationId + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return true;
  }
  return false;
};

export default wasNotificationShown;
