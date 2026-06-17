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
