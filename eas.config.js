export const environment = process.env.APP_ENV;
export const isDev = environment === 'local' || environment === 'testing';

export const baseUrl =
  environment === 'local'
    ? 'http://localhost:8081'
    : environment === 'testing'
    ? 'https://dev-api.easyplan.pro'
    : 'https://api.easyplan.pro';

export const baseApiUrl = `${baseUrl}/api`

export const imageLambdaUrl = 'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';
