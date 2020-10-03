import axios from 'axios';

// const baseURL = 'https://auth-nmcmweav5q-uc.a.run.app/api/authentication/';
const baseURL = 'http://localhost:8080/api/authentication/';

const instance = () =>
  axios.create({
    baseURL,
  });

export default {
  login: async (email, password) => {
    try {
      const response = await instance().post('v1/login', {
        username: email,
        password,
      });
      const { data: responseData } = response;
      return responseData;
    } catch (e) {
      return {
        isError: true,
        message: e.message,
      };
    }
  },
};
