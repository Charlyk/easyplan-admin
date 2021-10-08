const redirectIfOnGeneralHost = async (currentUser, router) => {
  const [subdomain] = window.location.host.split('.');
  if (['app', 'app-dev'].includes(subdomain)) {
    await router.replace('/clinics');
  }
}

export default redirectIfOnGeneralHost;
