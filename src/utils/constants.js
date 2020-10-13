import React from 'react';

import moment from 'moment';

import IconTooth11 from '../assets/icons/iconTooth11';
import IconTooth12 from '../assets/icons/iconTooth12';
import IconTooth13 from '../assets/icons/iconTooth13';
import IconTooth14 from '../assets/icons/iconTooth14';
import IconTooth15 from '../assets/icons/iconTooth15';
import IconTooth16 from '../assets/icons/iconTooth16';
import IconTooth17 from '../assets/icons/iconTooth17';
import IconTooth18 from '../assets/icons/iconTooth18';
import IconTooth21 from '../assets/icons/iconTooth21';
import IconTooth22 from '../assets/icons/iconTooth22';
import IconTooth23 from '../assets/icons/iconTooth23';
import IconTooth24 from '../assets/icons/iconTooth24';
import IconTooth25 from '../assets/icons/iconTooth25';
import IconTooth26 from '../assets/icons/iconTooth26';
import IconTooth27 from '../assets/icons/iconTooth27';
import IconTooth28 from '../assets/icons/iconTooth28';
import IconTooth31 from '../assets/icons/iconTooth31';
import IconTooth32 from '../assets/icons/iconTooth32';
import IconTooth33 from '../assets/icons/iconTooth33';
import IconTooth34 from '../assets/icons/iconTooth34';
import IconTooth35 from '../assets/icons/iconTooth35';
import IconTooth36 from '../assets/icons/iconTooth36';
import IconTooth37 from '../assets/icons/iconTooth37';
import IconTooth38 from '../assets/icons/iconTooth38';
import IconTooth41 from '../assets/icons/iconTooth41';
import IconTooth42 from '../assets/icons/iconTooth42';
import IconTooth43 from '../assets/icons/iconTooth43';
import IconTooth44 from '../assets/icons/iconTooth44';
import IconTooth45 from '../assets/icons/iconTooth45';
import IconTooth46 from '../assets/icons/iconTooth46';
import IconTooth47 from '../assets/icons/iconTooth47';
import IconTooth48 from '../assets/icons/iconTooth48';
import { textForKey } from './localization';

export const Role = {
  all: 'ALL',
  doctor: 'DOCTOR',
  admin: 'ADMIN',
  manager: 'MANAGER',
  reception: 'RECEPTION',
};

export const EmailRegex = /.+@.+\.[A-Za-z]+$/;
export const JwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export const S3Config = dirname => ({
  bucketName: 'easyplan-pro-files',
  dirName: dirname,
  region: 'eu-central-1',
  accessKeyId: 'AKIAIIQ6GZLJGOFJ77LA',
  secretAccessKey: 'hfPv7beCRvEm6v7j1nBzWgZyxX0MELjLzBv6rDai',
  // s3Url: 'https:/your-custom-s3-url.com/' /* optional */,
});

export const localeNameMapper = {
  ar: 'Arabic',
  bg: 'Bulgarian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  enGB: 'English (United Kingdom)',
  enUS: 'English (United States)',
  eo: 'Esperanto',
  es: 'Spanish',
  et: 'Estonian',
  faIR: 'Persian',
  fi: 'Finnish',
  fil: 'Filipino',
  fr: 'French',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Indonesian',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  ka: 'Georgian',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mk: 'Macedonian',
  nb: 'Norwegian Bokmål',
  nl: 'Dutch',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sr: 'Serbian',
  sv: 'Swedish',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  vi: 'Vietnamese',
  zhCN: 'Chinese Simplified',
  zhTW: 'Chinese Traditional',
};

export function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [
      moment({ hour }).format('HH:mm'),
      moment({ hour, minute: 30 }).format('HH:mm'),
    ]),
  );
}
export const days = [
  textForKey('Sunday'),
  textForKey('Monday'),
  textForKey('Tuesday'),
  textForKey('Wednesday'),
  textForKey('Thursday'),
  textForKey('Friday'),
  textForKey('Saturday'),
];

export const ScheduleStatuses = [
  { id: 'Pending', name: textForKey('Pending'), color: '#ffb902' },
  { id: 'Late', name: textForKey('Late'), color: '#FDC534' },
  { id: 'Confirmed', name: textForKey('Confirmed'), color: '#3A83DC' },
  { id: 'Canceled', name: textForKey('Canceled'), color: '#F44081' },
  // {
  //   id: 'CompletedNotPaid',
  //   name: textForKey('Completed not paid'),
  //   color: '#7DD7C8',
  // },
  // { id: 'CompletedPaid', name: textForKey('Completed paid'), color: '#00E987' },
  // { id: 'PartialPaid', name: textForKey('Partial paid'), color: '#9cfacc' },
];

export const teeth = [
  {
    type: 'top-left',
    toothId: '18',
    icon: <IconTooth18 />,
  },
  {
    type: 'top-left',
    toothId: '17',
    icon: <IconTooth17 />,
  },
  {
    type: 'top-left',
    toothId: '16',
    icon: <IconTooth16 />,
  },
  {
    type: 'top-left',
    toothId: '15',
    icon: <IconTooth15 />,
  },
  {
    type: 'top-left',
    toothId: '14',
    icon: <IconTooth14 />,
  },
  {
    type: 'top-left',
    toothId: '13',
    icon: <IconTooth13 />,
  },
  {
    type: 'top-left',
    toothId: '12',
    icon: <IconTooth12 />,
  },
  {
    type: 'top-left',
    toothId: '11',
    icon: <IconTooth11 />,
  },
  {
    type: 'top-right',
    toothId: '21',
    icon: <IconTooth21 />,
  },
  {
    type: 'top-right',
    toothId: '22',
    icon: <IconTooth22 />,
  },
  {
    type: 'top-right',
    toothId: '23',
    icon: <IconTooth23 />,
  },
  {
    type: 'top-right',
    toothId: '24',
    icon: <IconTooth24 />,
  },
  {
    type: 'top-right',
    toothId: '25',
    icon: <IconTooth25 />,
  },
  {
    type: 'top-right',
    toothId: '26',
    icon: <IconTooth26 />,
  },
  {
    type: 'top-right',
    toothId: '27',
    icon: <IconTooth27 />,
  },
  {
    type: 'top-right',
    toothId: '28',
    icon: <IconTooth28 />,
  },
  {
    type: 'bottom-left',
    toothId: '48',
    icon: <IconTooth48 />,
  },
  {
    type: 'bottom-left',
    toothId: '47',
    icon: <IconTooth47 />,
  },
  {
    type: 'bottom-left',
    toothId: '46',
    icon: <IconTooth46 />,
  },
  {
    type: 'bottom-left',
    toothId: '45',
    icon: <IconTooth45 />,
  },
  {
    type: 'bottom-left',
    toothId: '44',
    icon: <IconTooth44 />,
  },
  {
    type: 'bottom-left',
    toothId: '43',
    icon: <IconTooth43 />,
  },
  {
    type: 'bottom-left',
    toothId: '42',
    icon: <IconTooth42 />,
  },
  {
    type: 'bottom-left',
    toothId: '41',
    icon: <IconTooth41 />,
  },
  {
    type: 'bottom-right',
    toothId: '31',
    icon: <IconTooth31 />,
  },
  {
    type: 'bottom-right',
    toothId: '32',
    icon: <IconTooth32 />,
  },
  {
    type: 'bottom-right',
    toothId: '33',
    icon: <IconTooth33 />,
  },
  {
    type: 'bottom-right',
    toothId: '34',
    icon: <IconTooth34 />,
  },
  {
    type: 'bottom-right',
    toothId: '35',
    icon: <IconTooth35 />,
  },
  {
    type: 'bottom-right',
    toothId: '36',
    icon: <IconTooth36 />,
  },
  {
    type: 'bottom-right',
    toothId: '37',
    icon: <IconTooth37 />,
  },
  {
    type: 'bottom-right',
    toothId: '38',
    icon: <IconTooth38 />,
  },
];
