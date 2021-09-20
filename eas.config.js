export const environment = process.env.APP_ENV;
export const isDev = environment === 'local' || environment === 'testing';

export const appBaseUrl = environment === 'local'
  ? 'http://app.easyplan.loc'
  : environment === 'testing'
    ? 'https://app.dev.easyplan.pro'
    : 'https://app.easyplan.pro'

export const baseUrl =
  environment === 'local'
    ? 'http://localhost:8080'
    : environment === 'testing'
      ? 'https://dev-api.easyplan.pro'
      : 'https://api.easyplan.pro';

export const baseApiUrl = `${baseUrl}/api`

export const imageLambdaUrl = 'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';
