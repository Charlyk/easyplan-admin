import React from 'react';
import IconMoney from '@material-ui/icons/AttachMoney';
import IconClear from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import IconFree from '@material-ui/icons/MoneyOff';
import { enUS, ro, ru } from 'date-fns/locale';
import moment from 'moment-timezone';

import { environment } from 'eas.config';
import IconAppointmentCalendar from '../components/icons/iconAppointmentCalendar';
import IconCheckMark from '../components/icons/iconCheckMark';
import IconClock from '../components/icons/iconClock';
import IconCreditCard from '../components/icons/iconCreditCard';
import IconSuccess from '../components/icons/iconSuccess';
import IconTooth11 from '../components/icons/iconTooth11';
import IconTooth12 from '../components/icons/iconTooth12';
import IconTooth13 from '../components/icons/iconTooth13';
import IconTooth14 from '../components/icons/iconTooth14';
import IconTooth15 from '../components/icons/iconTooth15';
import IconTooth16 from '../components/icons/iconTooth16';
import IconTooth17 from '../components/icons/iconTooth17';
import IconTooth18 from '../components/icons/iconTooth18';
import IconTooth21 from '../components/icons/iconTooth21';
import IconTooth22 from '../components/icons/iconTooth22';
import IconTooth23 from '../components/icons/iconTooth23';
import IconTooth24 from '../components/icons/iconTooth24';
import IconTooth25 from '../components/icons/iconTooth25';
import IconTooth26 from '../components/icons/iconTooth26';
import IconTooth27 from '../components/icons/iconTooth27';
import IconTooth28 from '../components/icons/iconTooth28';
import IconTooth31 from '../components/icons/iconTooth31';
import IconTooth32 from '../components/icons/iconTooth32';
import IconTooth33 from '../components/icons/iconTooth33';
import IconTooth34 from '../components/icons/iconTooth34';
import IconTooth35 from '../components/icons/iconTooth35';
import IconTooth36 from '../components/icons/iconTooth36';
import IconTooth37 from '../components/icons/iconTooth37';
import IconTooth38 from '../components/icons/iconTooth38';
import IconTooth41 from '../components/icons/iconTooth41';
import IconTooth42 from '../components/icons/iconTooth42';
import IconTooth43 from '../components/icons/iconTooth43';
import IconTooth44 from '../components/icons/iconTooth44';
import IconTooth45 from '../components/icons/iconTooth45';
import IconTooth46 from '../components/icons/iconTooth46';
import IconTooth47 from '../components/icons/iconTooth47';
import IconTooth48 from '../components/icons/iconTooth48';
import IconXPerson from '../components/icons/iconXPerson';
import { textForKey } from './localization';

const host = typeof window !== 'undefined' ? window?.location.host : '';
export const env = host.startsWith('develop')
  ? 'dev'
  : host.startsWith('localhost')
  ? 'local'
  : '';

export const Role = {
  all: 'ALL',
  doctor: 'DOCTOR',
  admin: 'ADMIN',
  manager: 'MANAGER',
  reception: 'RECEPTION',
  invitations: 'INVITATIONS',
};

export const singleLineMaxCharLength = 60;
export const textAreaMaxCharLength = 250;

export const EmailRegex = /.+@.+\.[A-Za-z]+$/;
export const PasswordRegex =
  /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;
export const JwtRegex =
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
export const WebRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const FacebookAppId =
  environment === 'local' ? '367664371555800' : '2924106361197162';

export const YClientAPIUrl = 'https://api.yclients.com/api';

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

export const Statuses = [
  {
    id: 'Pending',
    name: textForKey('Pending'),
    color: '#ffb653',
    icon: <IconAppointmentCalendar />,
    statusIcon: null,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'Confirmed',
    name: textForKey('Confirmed'),
    color: '#5d76cb',
    icon: <IconCheckMark />,
    statusIcon: null,
    manual: true,
    isSchedule: true,
  },
  {
    id: 'PendingPayment',
    name: textForKey('Pending payment'),
    color: '#ffd180',
    icon: <IconAppointmentCalendar />,
    statusIcon: null,
    manual: false,
    isSchedule: false,
  },
  {
    id: 'WaitingForPatient',
    name: textForKey('Waiting for patient'),
    color: '#ffcfab',
    icon: <IconClock fill='#ffcfab' />,
    statusIcon: <IconClock fill='#ffcfab' />,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'OnSite',
    name: textForKey('On site'),
    color: '#4bba01',
    icon: <IconCheckMark />,
    statusIcon: <DoneIcon style={{ fill: '#4bba01' }} />,
    manual: true,
    isSchedule: true,
  },
  {
    id: 'Late',
    name: textForKey('Late'),
    color: '#cda4de',
    icon: <IconClock fill='#cda4de' />,
    statusIcon: null,
    manual: true,
    isSchedule: true,
  },
  {
    id: 'DidNotCome',
    name: textForKey("Didn't show up"),
    color: '#fc6c85',
    icon: <IconXPerson />,
    statusIcon: <IconClear style={{ fill: '#fc6c85' }} />,
    manual: true,
    isSchedule: true,
  },
  {
    id: 'Canceled',
    name: textForKey('Canceled'),
    color: '#fc2847',
    icon: <IconXPerson />,
    statusIcon: <IconClear style={{ fill: '#fc2847' }} />,
    manual: true,
    isSchedule: true,
  },
  {
    id: 'CompletedNotPaid',
    name: textForKey('Completed not paid'),
    color: '#9fe2bf',
    icon: <IconMoney />,
    statusIcon: <IconSuccess fill='#9fe2bf' />,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'CompletedPaid',
    name: textForKey('Paid'),
    color: '#1df914',
    icon: <IconCreditCard />,
    statusIcon: <DoneAllIcon style={{ fill: '#1df914' }} />,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'PartialPaid',
    name: textForKey('Partial paid'),
    color: '#1cd3a2',
    icon: <DoneAllIcon />,
    statusIcon: <IconSuccess fill='#1cd3a2' />,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'CompletedFree',
    name: textForKey('Completed. Free.'),
    color: '#bab86c',
    icon: <IconFree />,
    statusIcon: <DoneAllIcon style={{ fill: '#bab86c' }} />,
    manual: false,
    isSchedule: true,
  },
  {
    id: 'Paid',
    name: textForKey('Paid'),
    color: '#1df914',
    icon: <IconCreditCard />,
    statusIcon: null,
    manual: false,
    isSchedule: false,
  },
  {
    id: 'Rescheduled',
    name: textForKey('Rescheduled'),
    color: '#A71F8B',
    icon: <IconClock fill='#A71F8B' />,
    statusIcon: null,
    manual: true,
    isSchedule: true,
  },
];

export const ScheduleStatuses = Statuses.filter((item) => item.isSchedule);

export const ManualStatuses = Statuses.filter((item) => item.manual);

export const Teeth = [
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

export const Languages = [
  {
    id: 'ro',
    name: 'Româna',
  },
  {
    id: 'ru',
    name: 'Русский',
  },
  {
    id: 'en',
    name: 'English',
  },
  {
    id: 'it',
    name: 'Italiana',
  },
  {
    id: 'de',
    name: 'Deutsche',
  },
];

export const PatientSources = [
  {
    id: 'Unknown',
    name: textForKey('Unknown'),
    color: '#555555',
  },
  {
    id: 'Facebook',
    name: textForKey('Facebook'),
    color: '#4267B2',
  },
  {
    id: 'Instagram',
    name: textForKey('Instagram'),
    color: '#C13584',
  },
  {
    id: 'Twitter',
    name: textForKey('Twitter'),
    color: '#1DA1F2',
  },
  {
    id: 'LinkedIn',
    name: textForKey('LinkedIn'),
    color: '#0077B5',
  },
  {
    id: 'TV',
    name: textForKey('TV'),
    color: '#33FFCC',
  },
  {
    id: 'Radio',
    name: textForKey('Radio'),
    color: '#991AFF',
  },
  {
    id: 'Friend',
    name: textForKey('Friend'),
    color: '#4DB380',
  },
  {
    id: 'Google',
    name: textForKey('Google'),
    color: '#F4B400',
  },
  {
    id: 'Other',
    name: textForKey('Other'),
    color: '#809980',
  },
];

export const UnauthorizedPaths = [
  '/accept-invitation',
  '/confirmation',
  '/reset-password',
  '/register',
  '/login',
];

export const RestrictedSubdomains = [
  'app',
  'app-dev',
  'api',
  'dev-api',
  'easyplan',
  '',
];

export const HeaderKeys = {
  authorization: 'Authorization',
  clinicId: 'X-EasyPlan-Clinic-Id',
  subdomain: 'X-EasyPlan-Subdomain',
  contentType: 'Content-Type',
};

export const APP_DATA_API = '/api/analytics/app-data';

export const TECH_SUPPORT_URL =
  'https://tawk.to/chat/619407696bb0760a4942ea33/1fkl3ptc4';

export const colorArray = [
  '#6666FF',
  '#00B3E6',
  '#FF6633',
  '#3366E6',
  '#FF33FF',
  '#FFB399',
  '#FF1A66',
  '#4D8000',
  '#4D80CC',
  '#FFFF99',
  '#E6B333',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#B33300',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
];

export const DateLocales = {
  ro: ro,
  ru: ru,
  en: enUS,
};

export const AppLanguages = ['ro', 'ru', 'en'];
