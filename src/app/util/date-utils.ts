import * as moment from 'moment';
import {SelectItem} from 'primeng/api';
import {DateRange} from '../domain/util/date-range-select/date-range';

export class DateUtils {

  static getDateRangeSelectItem(range: DateRange): SelectItem {
    if (range == null) {
      return null;
    }
    const from = range.from;
    const until = range.until;

    if (from == null || until == null) {
      return null;
    }
    const fromMoment = moment(from);
    const untilMoment = moment(until);

    const fromDay = fromMoment.get('date');
    const untilDay = untilMoment.get('date');
    if (fromDay === 1 && untilDay === 1) {
      const thisMonth = moment().get('month');
      const prevMonth = moment().add(-1, 'month').get('month');
      const nextMonth = moment().add(1, 'month').get('month');
      const fromMonth = fromMoment.get('month');
      const untilMonth = untilMoment.get('month');
      if (fromMonth === prevMonth && untilMonth === thisMonth) {
        return {
          label: `Last month`,
          icon: 'fa fa-calendar',
          value: range
        };
      } else if (fromMonth === thisMonth && untilMonth === nextMonth) {
        return {
          label: `This month`,
          icon: 'fa fa-calendar',
          value: range
        };
      }
    }


    const fromWeekday = fromMoment.get('isoWeekday');
    const untilWeekday = untilMoment.get('isoWeekday');
    const startOfWeekDay = fromMoment.clone().startOf('week').get('isoWeekday');
    if (fromWeekday === startOfWeekDay && untilWeekday === startOfWeekDay) {
      const thisWeek = moment().get('week');
      const prevWeek = moment().add(-1, 'week').get('week');
      const nextWeek = moment().add(1, 'week').get('week');
      const fromWeek = fromMoment.get('week');
      const untilWeek = untilMoment.get('week');
      if (fromWeek === prevWeek && untilWeek === thisWeek) {
        return {
          label: `Last week`,
          icon: 'fa fa-calendar',
          value: range
        };
      } else if (fromWeek === thisWeek && untilWeek === nextWeek) {
        return {
          label: `This week`,
          icon: 'fa fa-calendar',
          value: range
        };
      }
    }

    const today = moment().startOf('day');
    const yesterday = today.clone().add(-1, 'day');
    const tomorrow = today.clone().add(1, 'day');
    if (fromMoment.diff(today, 'day') === 0
      && untilMoment.diff(tomorrow, 'day') === 0) {
      return {
        label: `Today`,
        icon: 'fa fa-calendar',
        value: range
      };
    } else if (fromMoment.diff(yesterday, 'day') === 0
      && untilMoment.diff(today, 'day') === 0) {
      return {
        label: `Yesterday`,
        icon: 'fa fa-calendar',
        value: range
      };
    } else {
      const fromDateLabel = fromMoment.format('L');
      const untilDateLabel = untilMoment.format('L');
      return {
        label: `From ${fromDateLabel} until ${untilDateLabel}`,
        icon: 'fa fa-calendar',
        value: range
      };
    }
  }

}
