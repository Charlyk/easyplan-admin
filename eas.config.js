export const environment = process.env.APP_ENV;
export const isDev = environment === 'local';

export const baseApiUrl =
  environment === 'local'
    ? 'http://localhost:8081/api'
    : environment === 'development'
      ? 'https://dev-api.easyplan.pro/api'
      : 'https://api.easyplan.pro/api';

export const baseAppUrl =
  environment === 'local'
    ? 'http://localhost:3000'
    : environment === 'development'
      ? 'https://dev-app.easyplan.pro'
      : 'https://app.easyplan.pro';

export const imageLambdaUrl = 'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';
