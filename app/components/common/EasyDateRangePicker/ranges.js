import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import endOfDay from 'date-fns/endOfDay';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';

import { textForKey } from 'app/utils/localization';

const defineds = {
  startOfWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
  endOfWeek: endOfWeek(new Date(), { weekStartsOn: 1 }),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

export function createStaticRanges(ranges) {
  return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
}

export const localizedStaticRanges = createStaticRanges([
  {
    label: textForKey('Today'),
    range: () => ({
      startDate: defineds.startOfToday,
      endDate: defineds.endOfToday,
    }),
  },
  {
    label: textForKey('Yesterday'),
    range: () => ({
      startDate: defineds.startOfYesterday,
      endDate: defineds.endOfYesterday,
    }),
  },

  {
    label: textForKey('This Week'),
    range: () => ({
      startDate: defineds.startOfWeek,
      endDate: defineds.endOfWeek,
    }),
  },
  {
    label: textForKey('Last Week'),
    range: () => ({
      startDate: defineds.startOfLastWeek,
      endDate: defineds.endOfLastWeek,
    }),
  },
  {
    label: textForKey('This Month'),
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
    }),
  },
  {
    label: textForKey('Last Month'),
    range: () => ({
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
    }),
  },
]);

export const localizedInputRanges = [
  {
    label: textForKey('days up to today'),
    range(value) {
      return {
        startDate: addDays(
          defineds.startOfToday,
          (Math.max(Number(value), 1) - 1) * -1,
        ),
        endDate: defineds.endOfToday,
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
      if (!range.startDate) return '???';
      return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
    },
  },
  {
    label: textForKey('days starting today'),
    range(value) {
      const today = new Date();
      return {
        startDate: today,
        endDate: addDays(today, Math.max(Number(value), 1) - 1),
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
      if (!range.endDate) return '???';
      return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
    },
  },
];
