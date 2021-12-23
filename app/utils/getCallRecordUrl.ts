import moment from 'moment-timezone';
import { PatientCallRecord } from 'types';

const getCallRecordUrl = (record: PatientCallRecord) => {
  const recordDate = moment(record.created);
  const year = recordDate.format('YYYY');
  const month = recordDate.format('MM');
  const date = recordDate.format('DD');
  return encodeURI(
    `https://sip6215.iphost.md/monitor/${year}/${month}/${date}/${record.fileUrl}`,
  );
};

export default getCallRecordUrl;
