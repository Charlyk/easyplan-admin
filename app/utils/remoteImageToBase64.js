import axios from "axios";

const remoteImageToBase64 = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
    headers: {
      mode: 'no-cors',
      Accept: '*/*'
    },
  });
  return Buffer.from(response.data, 'binary').toString('base64')
}

export default remoteImageToBase64;
