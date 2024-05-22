/**
 * Formats a given date into a string representation.
 * @param date - The date to be formatted.
 * @param iso - Optional. Specifies whether to return the date in ISO format. Default is false.
 * @returns The formatted date string.
 */
export function formatDate(date: Date, iso: boolean = false) {
  const _date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
  if (iso)
    return _date
  return _date.split('T')[0]
}
