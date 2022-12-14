import moment from 'moment-timezone';
import { textForKey } from 'app/utils/localization';
import {
  CrmFilterOption,
  CrmFilterShortcut,
  DealShortcutType,
  DealStateType,
  ReminderTypeEnum,
} from 'types';

export const defaultRange = [
  moment().toDate(),
  moment().add(10, 'days').toDate(),
];

export const Shortcuts: CrmFilterShortcut[] = [
  {
    id: DealShortcutType.All,
    type: 'default',
    name: textForKey('crm_filter_all_deals'),
  },
  {
    id: DealShortcutType.Opened,
    type: 'default',
    name: textForKey('crm_filter_opened_deals'),
  },
  {
    id: DealShortcutType.Mine,
    type: 'default',
    name: textForKey('crm_filter_my_deals'),
  },
  {
    id: DealShortcutType.Success,
    type: 'default',
    name: textForKey('crm_filter_closed_successfully'),
  },
  {
    id: DealShortcutType.Closed,
    type: 'default',
    name: textForKey('crm_filter_not_realized'),
  },
  {
    id: DealShortcutType.TodayTasks,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_today_reminders'),
  },
  {
    id: DealShortcutType.ExpiredTasks,
    type: 'reminder',
    name: textForKey('crm_filter_shortcuts_expired_tasks'),
  },
];

export const reminderOptions: CrmFilterOption[] = [
  {
    id: ReminderTypeEnum.All,
    name: textForKey('crm_filter_all_reminders'),
  },
  {
    id: ReminderTypeEnum.Today,
    name: textForKey('crm_filter_today_reminders'),
  },
  {
    id: ReminderTypeEnum.Tomorrow,
    name: textForKey('crm_filter_tomorrow_reminders'),
  },
  {
    id: ReminderTypeEnum.Week,
    name: textForKey('crm_filter_current_week_reminders'),
  },
  {
    id: ReminderTypeEnum.NoTasks,
    name: textForKey('crm_filter_without_tasks'),
  },
  {
    id: ReminderTypeEnum.Expired,
    name: textForKey('crm_filter_expired_tasks'),
  },
];
export const statesOptions: CrmFilterOption[] = [
  {
    id: DealStateType.Unsorted,
    name: DealStateType.Unsorted.valueOf(),
  },
];
