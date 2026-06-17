import { useState, useEffect } from 'react';
import { getRecords, getSettings, getYesterdayStr, formatDuration, formatDurationDecimal } from '../store';
import { SleepRecord, QUALITY_LABELS } from '../types';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [record, setRecord] = useState<SleepRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<SleepRecord[]>([]);
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    const records = getRecords();
    const yesterday = getYesterdayStr();
    const yesterdayRecord = records.find(r => r.date === yesterday);
    setRecord(yesterdayRecord || null);
    setRecentRecords(records.slice(0, 7));
    setSettings(getSettings());
  }, []);

  const targetMinutes = settings.targetSleepHours * 60;

  return (
    <div>
      <div className="card">
        <div className="card-title">昨晚睡眠</div>
        {record ? (
          <>
            <div className="sleep-time-display">
              <div className="time-block">
                <div className="label">入睡</div>
                <div className="value">{record.bedTime}</div>
              </div>
              <div className="time-arrow">→</div>
              <div className="time-block">
                <div className="label">起床</div>
                <div className="value">{record.wakeTime}</div>
              </div>
            </div>

            <div className="duration-display">
              <div className="hours">
                <span style={{ color: record.duration < targetMinutes ? '#ef5350' : '#4fc3f7' }}>
                  {formatDurationDecimal(record.duration)}
                </span>
                <span className="unit">小时</span>
              </div>
              <div className="subtitle">
                {formatDuration(record.duration)}
                {record.duration < targetMinutes && (
                  <span style={{ color: '#ef5350', marginLeft: 8 }}>
                    (未达标 {settings.targetSleepHours}h)
                  </span>
                )}
              </div>
            </div>

            <StarDisplay rating={record.quality} />
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              {QUALITY_LABELS[record.quality]}
            </div>

            {record.tags.length > 0 && (
              <div className="tags-container" style={{ justifyContent: 'center', marginTop: 16 }}>
                {record.tags.map(tag => (
                  <span key={tag} className="tag selected" style={{ cursor: 'default' }}>{tag}</span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <p>昨晚还没有记录</p>
            <p style={{ fontSize: '0.8rem' }}>点击右下角 + 添加睡眠记录</p>
          </div>
        )}
      </div>

      {recentRecords.length > 0 && (
        <div className="card">
          <div className="card-title">最近记录</div>
          <div className="sleep-records">
            {recentRecords.map(r => (
              <div key={r.id} className="record-item">
                <div>
                  <div className="record-date">{r.date}</div>
                  <div className="record-time">{r.bedTime} - {r.wakeTime}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`record-duration ${r.duration < targetMinutes ? 'unmet' : ''}`}>
                    {formatDuration(r.duration)}
                  </div>
                  <span className={`quality-badge quality-${r.quality}`}>
                    {r.quality}星
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">
            {recentRecords.length > 0
              ? formatDurationDecimal(recentRecords.reduce((s, r) => s + r.duration, 0) / recentRecords.length)
              : '--'}
          </div>
          <div className="stat-label">平均睡眠 (小时)</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {recentRecords.length > 0
              ? (recentRecords.reduce((s, r) => s + r.quality, 0) / recentRecords.length).toFixed(1)
              : '--'}
          </div>
          <div className="stat-label">平均质量</div>
        </div>
      </div>
    </div>
  );
}
