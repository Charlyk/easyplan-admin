export const environment = process.env.APP_ENV;
export const pubNub = 'testing' ?? environment;
export const isDev = environment === 'local' || environment === 'testing';

export const appBaseUrl =
  environment === 'local'
    ? 'http://localhost:3000'
    : environment === 'testing'
    ? 'https://app.dev.easyplan.pro'
    : 'https://app.easyplan.pro';

export const baseUrl =
  environment === 'local'
    ? process.env.API_URL
    : environment === 'testing'
    ? 'https://dev-api.easyplan.pro'
    : 'https://api.easyplan.pro';

export const baseApiUrl = `${baseUrl}/api`;

export const awsBaseUrl =
  'https://easyplan-pro-files.s3.eu-central-1.amazonaws.com';
