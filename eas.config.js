export const environment = process.env.APP_ENV;
export const pubNubEnv = process.env.PUBNUB_ENV ?? environment;
export const isDev = environment === 'local' || environment === 'testing';

export const appBaseUrl = process.env.APP_URL;

export const loginUrl = `${process.env.AUTH_APP_URL}/auth`;

export const baseUrl = process.env.API_URL;

export const baseApiUrl = `${baseUrl}/api`;

export const awsBaseUrl =
  'https://easyplan-pro-files.s3.eu-central-1.amazonaws.com';
