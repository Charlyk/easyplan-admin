import { textForKey } from 'app/utils/localization';

export const charactersRegex = /[а-яА-ЯЁёĂăÎîȘșȚțÂâ]/;

export const languages = [
  {
    id: 'ro',
    name: 'Română',
  },
  {
    id: 'ru',
    name: 'Русский',
  },
  {
    id: 'en',
    name: 'English',
  },
];

export const tags = [
  {
    id: '{{patientFullName}}',
    label: 'patient full name',
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
    length: 19,
    placeholder: '###################',
  },
  {
    id: '{{patientFirstName}}',
    label: 'patient first name',
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
    length: 20,
    placeholder: '####################',
  },
  {
    id: '{{patientLastName}}',
    label: 'patient last name',
    availableFor: [
      'ScheduleNotification',
      'BirthdayCongrats',
      'HolidayCongrats',
      'PromotionalMessage',
      'OnetimeMessage',
    ],
    length: 19,
    placeholder: '###################',
  },
  {
    id: '{{confirmationLink}}',
    label: 'confirmation link',
    availableFor: ['ScheduleNotification'],
    length: 23,
    placeholder: '#######################',
  },
  {
    id: '{{clinicName}}',
    label: 'clinic name',
    availableFor: ['ScheduleNotification'],
    length: 14,
    placeholder: '##############',
  },
  {
    id: '{{scheduleHour}}',
    label: 'schedule hour',
    availableFor: ['ScheduleNotification'],
    length: 5,
    placeholder: '#####',
  },
  {
    id: '{{scheduleDate}}',
    label: 'schedule date',
    availableFor: ['ScheduleNotification'],
    length: 10,
    placeholder: '##########',
  },
];

export const messageTypeDescription = {
  ScheduleNotification: textForKey('schedulenotificationdesc'),
  BirthdayCongrats: textForKey('birthdaycongratsdesc'),
  HolidayCongrats: textForKey('holidaycongratsdesc'),
  PromotionalMessage: textForKey('promotionalmessagedesc'),
  OnetimeMessage: textForKey('onetimemessagedesc'),
};

export const availableLanguages = ['ro', 'ru', 'en'];

export const availableHours = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

export const messageTypeEnum = {
  ScheduleNotification: 'ScheduleNotification',
  BirthdayCongrats: 'BirthdayCongrats',
  HolidayCongrats: 'HolidayCongrats',
  PromotionalMessage: 'PromotionalMessage',
  OnetimeMessage: 'OnetimeMessage',
};

export const getRealMessageLength = (language, message, currentClinic) => {
  let messageValue = message[language];
  tags.forEach((tag) => {
    messageValue = messageValue.replace(
      tag.id,
      tag.id !== '{{clinicName}}' ? tag.placeholder : currentClinic.smsAlias,
    );
  });
  return messageValue.length;
};
