import { S3Config } from "../app/utils/constants";
import uuid from "react-uuid";

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
