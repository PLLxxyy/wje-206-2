import { SleepRecord, AppSettings } from './types';

const RECORDS_KEY = 'sleep_records';
const SETTINGS_KEY = 'sleep_settings';

export function getRecords(): SleepRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: SleepRecord): void {
  const records = getRecords();
  records.push(record);
  records.sort((a, b) => b.createdAt - a.createdAt);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter(r => r.id !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { targetSleepHours: 8 };
  } catch {
    return { targetSleepHours: 8 };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function calcDuration(bedTime: string, wakeTime: string): number {
  const [bH, bM] = bedTime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);
  let bed = bH * 60 + bM;
  let wake = wH * 60 + wM;
  if (wake <= bed) wake += 24 * 60;
  return wake - bed;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分`;
}

export function formatDurationDecimal(minutes: number): string {
  return (minutes / 60).toFixed(1);
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getPrevDayStr(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getCurrentStreak(records: SleepRecord[]): number {
  if (records.length === 0) return 0;

  const dateSet = new Set(records.map(r => r.date));
  let streak = 0;
  let currentDate = getYesterdayStr();

  while (dateSet.has(currentDate)) {
    streak++;
    currentDate = getPrevDayStr(currentDate);
  }

  return streak;
}

export function getMaxStreak(records: SleepRecord[]): number {
  if (records.length === 0) return 0;

  const sortedDates = [...new Set(records.map(r => r.date))].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}
