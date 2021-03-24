import types from '../types/types';

/**
 * Update status for an sms message
 * @param {{ id: number, status: string }|null} payload
 * @return {{payload, type: string}}
 */
export function setSMSMessageStatus(payload) {
  return {
    type: types.setSMSMessageStatus,
    payload,
  };
}