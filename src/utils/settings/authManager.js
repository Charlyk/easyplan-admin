export default {
  setUserToken: token => {
    localStorage.setItem('auth_token', token);
  },

  setUserId: userId => {
    localStorage.setItem('user_id', userId);
  },

  getUserToken: () => {
    return localStorage.getItem('auth_token');
  },

  getUserId: () => {
    return localStorage.getItem('user_id');
  },

  isLoggedIn: () => {
    return localStorage.getItem('auth_token') != null;
  },

  logOut: () => {
    localStorage.removeItem('auth_token');
  },
};
