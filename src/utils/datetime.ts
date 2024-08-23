import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import getYear from 'date-fns/getYear';

function zeroPad(secondsOrMinutes: number): string {
  return secondsOrMinutes < 10 ? '0' + secondsOrMinutes : secondsOrMinutes.toString();
}

export function formatDuration(totalSeconds: number): string {
  const datetime = new Date(totalSeconds * 1000);
  const h = datetime.getUTCHours();
  const m = datetime.getUTCMinutes();
  const s = datetime.getUTCSeconds();
  return h > 0 ? `${h}:${zeroPad(m)}:${zeroPad(s)}` : `${m}:${zeroPad(s)}`;
}

export function formatScrobbleTimestamp(timestamp: Date, use12Hours: boolean): string {
  let timestampFormat = '';
  if (!isToday(timestamp)) {
    timestampFormat = use12Hours ? 'M/d' : 'd/MM';
    if (getYear(timestamp) < getYear(new Date())) {
      timestampFormat += '/yyyy';
    }
    timestampFormat += ' ';
  }
  timestampFormat += use12Hours ? 'hh:mm a' : 'HH:mm';
  return format(timestamp, timestampFormat);
}
