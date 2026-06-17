export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  duration: number; // minutes
  quality: number; // 1-5
  tags: string[];
  createdAt: number;
}

export type SleepTag = '多梦' | '失眠' | '打鼾' | '起夜' | '早醒' | '磨牙' | '说梦话' | '睡得很好';

export const SLEEP_TAGS: SleepTag[] = ['多梦', '失眠', '打鼾', '起夜', '早醒', '磨牙', '说梦话', '睡得很好'];

export const QUALITY_LABELS: Record<number, string> = {
  1: '很差',
  2: '较差',
  3: '一般',
  4: '良好',
  5: '优秀',
};

export interface AppSettings {
  targetSleepHours: number; // e.g. 7.5
}
