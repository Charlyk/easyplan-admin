import moment from 'moment';

export function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [moment({ hour }).format('HH:mm')]),
  );
}
