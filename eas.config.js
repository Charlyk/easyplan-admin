export const isDev = process.env.NODE_ENV !== 'production';
export const baseApiUrl = isDev ? 'http://localhost:8080/api' : 'https://api.easyplan.pro/api'
export const baseAppUrl = isDev ? 'http://localhost:3000' : 'https://app.easyplan.pro'
