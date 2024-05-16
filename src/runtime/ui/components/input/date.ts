import dt from 'dayjs'

interface PresetPoint {
  value: dt.Dayjs
  label: string
}

interface PresetRange {
  start: dt.Dayjs
  end: dt.Dayjs
  label: string
  type: 'day' | 'week' | 'month'
  value: string
  caption: string
}

export function presetsPoint() {
  const presets: PresetPoint[] = []
  presets.push({
    value: dt().subtract(1, 'day'),
    label: 'Вчера',
  })
  presets.push({
    value: dt(),
    label: 'Сегодня',
  })
  presets.push({
    value: dt().add(1, 'day'),
    label: 'Завтра',
  })
  return presets
}

export function presetsRange() {
  const presets: PresetRange[] = []
  {
    const date = dt().subtract(1, 'day')
    presets.push({
      start: date,
      end: date,
      label: 'Вчера',
      type: 'day',
      caption: date.format('D MMMM'),
      value: '',
    })
  }
  {
    const date = dt()
    presets.push({
      start: date,
      end: date,
      label: 'Сегодня',
      type: 'day',
      caption: date.format('D MMMM'),
      value: '',
    })
  }
  {
    const date = dt().subtract(1, 'week')
    const dateStart = date.day() > 0
      ? date.startOf('week').subtract(1, 'week').add(4, 'days')
      : date.startOf('week').add(4, 'days')
    const dateEnd = dateStart.add(6, 'day')
    presets.push({
      start: dateStart,
      end: dateEnd,
      label: 'Прошлая неделя',
      type: 'week',
      caption: `${dateStart.format('D MMM')} - ${dateEnd.format('D MMM')}`,
      value: '',
    })
  }
  {
    const date = dt()
    const dateStart = date.day() > 0
      ? date.startOf('week').subtract(1, 'week').add(4, 'days')
      : date.startOf('week').add(4, 'days')
    const dateEnd = dateStart.add(6, 'day')

    presets.push({
      start: dateStart,
      end: dateEnd,
      label: 'Текущая неделя',
      type: 'week',
      caption: `${dateStart.format('D MMM')} - ${dateEnd.format('D MMM')}`,
      value: '',
    })
  }
  {
    const date = dt().subtract(1, 'month')
    const dateStart = date.startOf('month')
    const dateEnd = date.endOf('month')
    presets.push({
      start: dateStart,
      end: dateEnd,
      label: 'Прошлий месяц',
      type: 'month',
      caption: date.format('MMMM YYYY'),
      value: '',
    })
  }
  {
    const date = dt()
    const dateStart = date.startOf('month')
    const dateEnd = date.endOf('month')
    presets.push({
      start: dateStart,
      end: dateEnd,
      label: 'Текущий месяц',
      type: 'month',
      caption: date.format('MMMM YYYY'),
      value: '',
    })
  }
  for (const preset of presets)
    preset.value = `${preset.start.format('YYYY-MM-DD')} - ${preset.end.format('YYYY-MM-DD')}`
  return presets
}

export function daysForLocale(localeName = navigator.language, weekday: 'long' | 'short' | 'narrow' = 'long') {
  const { format } = new Intl.DateTimeFormat(localeName, { weekday })
  return [...Array(7).keys()]
    .map(day => format(new Date(Date.UTC(2021, 5, day))))
}

export function monthsForLocale(localeName = navigator.language, month: 'long' | 'short' | 'narrow' = 'long') {
  const { format } = new Intl.DateTimeFormat(localeName, { month })
  return [...Array(12).keys()]
    .map(month => format(new Date(Date.UTC(2021, month, 1))))
}
