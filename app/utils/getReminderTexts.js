import moment from 'moment-timezone';

import getPatientName from './getPatientName';
import { textForKey } from './localization';

const getReminderTexts = (reminder) => {
  if (reminder == null) {
    return null;
  }
  const { assignee, createdBy } = reminder;
  const dueDate = moment(reminder.dueDate);
  const endDate = moment(reminder.endDate);
  let contactName = '';
  if (reminder.deal.patient != null) {
    contactName = getPatientName(reminder.deal.patient);
  } else {
    contactName =
      reminder.deal.contact.name || reminder.deal.contact.phoneNumber;
  }
  const isExpired = dueDate.isBefore(moment(), 'minutes');
  const isToday = dueDate.isSame(moment(), 'date');
  const stringDate = dueDate.format('DD MMM YYYY');
  const stringTime = `${dueDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;
  const timeText = isToday
    ? `${textForKey('crm_reminder_today')} ${stringTime}`
    : `${stringDate} ${textForKey('crm_reminder_at')} ${stringTime}`;
  const assigneeName = `${assignee.firstName} ${assignee.lastName}`;
  const createdByName = `${createdBy.firstName} ${createdBy.lastName}`;
  const headerText = `${timeText} ${textForKey(
    'crm_reminder_for',
  ).toLowerCase()} ${assigneeName}`;
  return {
    isExpired,
    isToday,
    timeText,
    assigneeName,
    headerText,
    stringTime,
    stringDate,
    createdByName,
    contactName,
  };
};

export default getReminderTexts;
