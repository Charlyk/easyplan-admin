import PubNub from 'pubnub';

const pubnubUUID = PubNub.generateUUID();
const initializationParams = {
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid: pubnubUUID,
};

export const pubnubClient: PubNub = new PubNub(initializationParams);
