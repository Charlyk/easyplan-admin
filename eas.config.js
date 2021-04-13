export const environment = process.env.APP_ENV;
export const isDev = environment === 'local' || environment === 'testing';

export const baseApiUrl =
  environment === 'local'
    ? 'http://localhost:8081/api'
    : environment === 'testing'
      ? 'https://dev-api.easyplan.pro/api'
      : 'https://api.easyplan.pro/api';

export const imageLambdaUrl = 'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';
