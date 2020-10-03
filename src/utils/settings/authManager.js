export default {
  setUserToken: token => {
    localStorage.setItem('auth_token', token);
  },

  getUserToken: () => {
    return localStorage.getItem('auth_token');
  },

  isLoggedIn: () => {
    return localStorage.getItem('auth_token') != null;
  },

  logOut: () => {
    localStorage.removeItem('auth_token');
  },
};
