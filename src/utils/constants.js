export const Role = {
  all: 'ALL',
  doctor: 'DOCTOR',
  admin: 'ADMIN',
  manager: 'MANAGER',
  reception: 'RECEPTION',
};

export const EmailRegex = /.+@.+\.[A-Za-z]+$/;

export const S3Config = dirname => ({
  bucketName: 'easyplan-pro-files',
  dirName: dirname,
  region: 'eu-central-1',
  accessKeyId: 'AKIAIIQ6GZLJGOFJ77LA',
  secretAccessKey: 'hfPv7beCRvEm6v7j1nBzWgZyxX0MELjLzBv6rDai',
  // s3Url: 'https:/your-custom-s3-url.com/' /* optional */,
});
