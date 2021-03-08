export default {
  setUserToken: token => {
    typeof localStorage !== 'undefined' && localStorage.setItem('auth_token', token);
  },

  setUserId: userId => {
    typeof localStorage !== 'undefined' && localStorage.setItem('user_id', userId);
  },

  getUserToken: () => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : '';
  },

  getUserId: () => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : '';
  },

  isLoggedIn: () => {
    return typeof localStorage !== 'undefined'? localStorage.getItem('auth_token') != null : false;
  },

  logOut: () => {
    typeof localStorage !== 'undefined' && localStorage.removeItem('auth_token');
  },
};
