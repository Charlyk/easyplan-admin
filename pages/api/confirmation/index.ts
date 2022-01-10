import { textForKey } from 'app/utils/localization/index';

export default async function sendICS(req, res) {
  const { startDate, endDate } = req.query;
  const fileContent = generateICS(
    startDate,
    endDate,
    textForKey('appointment_to_doctor'),
  );
  res.setHeader('Content-type', 'application/octet-stream');

  res.setHeader('Content-disposition', `attachment; filename=${startDate}.ics`);
  res.send(fileContent);
}

const generateICS = (startDate, endDate, text) => {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODIN:-//ZContent.net//Zap Calendar 1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${text}
END:VEVENT
END:VCALENDAR`;
};
