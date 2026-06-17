import { useState, useEffect } from 'react';
import { getRecords, getSettings, formatDuration, formatDurationDecimal } from '../store';
import { SleepRecord } from '../types';

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
}

export default function WeeklyPage() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    setRecords(getRecords());
    setSettings(getSettings());
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = formatDate(d);
    const record = records.find(r => r.date === dateStr);
    return { date: d, dateStr, record, dayName: DAY_NAMES[d.getDay()] };
  });

  const maxDuration = Math.max(...days.map(d => d.record?.duration || 0), settings.targetSleepHours * 60);
  const targetMinutes = settings.targetSleepHours * 60;

  const recordedDays = days.filter(d => d.record);
  const avgDuration = recordedDays.length > 0
    ? recordedDays.reduce((s, d) => s + d.record!.duration, 0) / recordedDays.length
    : 0;
  const avgQuality = recordedDays.length > 0
    ? recordedDays.reduce((s, d) => s + d.record!.quality, 0) / recordedDays.length
    : 0;

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  return (
    <div>
      <div className="week-selector">
        <button onClick={prevWeek}>← 上周</button>
        <span className="current">{formatWeekRange(weekStart)}</span>
        <button onClick={nextWeek}>下周 →</button>
      </div>

      <div className="card">
        <div className="card-title">每日睡眠时长</div>
        <div className="bar-chart">
          {days.map((day, i) => {
            const height = day.record ? (day.record.duration / maxDuration) * 100 : 0;
            const unmet = day.record ? day.record.duration < targetMinutes : false;
            return (
              <div key={i} className="bar-wrapper">
                <div className="bar-value">
                  {day.record ? formatDurationDecimal(day.record.duration) : ''}
                </div>
                <div
                  className={`bar ${unmet ? 'unmet' : ''}`}
                  style={{ height: `${Math.max(height, day.record ? 4 : 0)}%` }}
                />
                <div className="bar-label">{day.dayName}</div>
              </div>
            );
          })}
        </div>
        {targetMinutes > 0 && (
          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            目标: {settings.targetSleepHours}小时 {recordedDays.some(d => d.record!.duration < targetMinutes) ? '(红色未达标)' : ''}
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className={`stat-value ${avgDuration < targetMinutes ? 'unmet' : ''}`}>
            {avgDuration > 0 ? formatDurationDecimal(avgDuration) : '--'}
          </div>
          <div className="stat-label">平均睡眠 (小时)</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {avgQuality > 0 ? avgQuality.toFixed(1) : '--'}
          </div>
          <div className="stat-label">平均质量</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{recordedDays.length}</div>
          <div className="stat-label">记录天数</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {recordedDays.length > 0
              ? recordedDays.filter(d => d.record!.duration >= targetMinutes).length
              : '--'}
          </div>
          <div className="stat-label">达标天数</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">每日详情</div>
        <div className="sleep-records">
          {days.map((day, i) => (
            <div key={i} className="record-item">
              <div>
                <div className="record-date">{day.dateStr} 周{day.dayName}</div>
                {day.record ? (
                  <div className="record-time">{day.record.bedTime} - {day.record.wakeTime}</div>
                ) : (
                  <div className="record-time" style={{ color: 'rgba(255,255,255,0.2)' }}>无记录</div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {day.record ? (
                  <>
                    <div className={`record-duration ${day.record.duration < targetMinutes ? 'unmet' : ''}`}>
                      {formatDuration(day.record.duration)}
                    </div>
                    <span className={`quality-badge quality-${day.record.quality}`}>
                      {day.record.quality}星
                    </span>
                  </>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
