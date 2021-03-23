export const isDev = process.env.NODE_ENV !== 'production';
// const testUrl = 'https://api.easyplan.pro/dev/api'
const testUrl = 'http://localhost:8080/api'
export const baseApiUrl = isDev ? testUrl : 'https://api.easyplan.pro/api'
export const baseAppUrl = isDev ? 'http://localhost:3000' : 'https://app.easyplan.pro'
export const imageLambdaUrl = 'https://d25mcgbnpi.execute-api.eu-west-1.amazonaws.com/production';
