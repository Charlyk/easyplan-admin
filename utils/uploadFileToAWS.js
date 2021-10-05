import uuid from "react-uuid";
import S3 from 'react-aws-s3';
import { S3Config } from "../app/utils/constants";

/**
 * Upload a file to AWS
 * @param {string} path
 * @param {Object} file
 * @param {boolean} tmp
 * @return {Promise<Object|null>}
 */
export default async function uploadFileToAWS(path, file, tmp = false) {
  const s3client = new S3(S3Config(path));
  const fileName = `${tmp ? 'tmp_' : ''}${uuid()}-${file.name}`;
  return await s3client.uploadFile(file, fileName);
}
