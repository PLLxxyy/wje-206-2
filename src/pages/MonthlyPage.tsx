import { useState, useEffect } from 'react';
import { getRecords, getSettings, formatDurationDecimal, getMaxStreak } from '../store';
import { SleepRecord } from '../types';

function getMonthDays(year: number, month: number): string[] {
  const days: string[] = [];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export default function MonthlyPage() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [settings, setSettings] = useState(getSettings());
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const recs = getRecords();
    setRecords(recs);
    setSettings(getSettings());
    setMaxStreak(getMaxStreak(recs));
  }, []);

  const monthDays = getMonthDays(year, month);
  const monthRecords = records.filter(r => r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`));
  const targetMinutes = settings.targetSleepHours * 60;

  const avgDuration = monthRecords.length > 0
    ? monthRecords.reduce((s, r) => s + r.duration, 0) / monthRecords.length
    : 0;
  const avgQuality = monthRecords.length > 0
    ? monthRecords.reduce((s, r) => s + r.quality, 0) / monthRecords.length
    : 0;
  const maxDuration = Math.max(...monthRecords.map(r => r.duration), targetMinutes);
  const metDays = monthRecords.filter(r => r.duration >= targetMinutes).length;
  const unmetDays = monthRecords.filter(r => r.duration < targetMinutes).length;

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const qualityDist = [0, 0, 0, 0, 0];
  monthRecords.forEach(r => { qualityDist[r.quality - 1]++; });
  const totalRecords = monthRecords.length || 1;

  const qualityColors = ['#ef5350', '#ffa726', '#ffd54f', '#4fc3f7', '#66bb6a'];

  const tagCount: Record<string, number> = {};
  monthRecords.forEach(r => {
    r.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
  });

  return (
    <div>
      <div className="month-selector">
        <button onClick={prevMonth}>← 上月</button>
        <span className="current">{year}年{month}月</span>
        <button onClick={nextMonth}>下月 →</button>
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
          <div className="stat-value" style={{ color: '#66bb6a' }}>{metDays}</div>
          <div className="stat-label">达标天数</div>
        </div>
        <div className="stat-item">
          <div className="stat-value unmet">{unmetDays}</div>
          <div className="stat-label">未达标天数</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: '#ff7043' }}>{maxStreak}</div>
          <div className="stat-label">历史最高连续 (天)</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">睡眠趋势</div>
        <div className="line-chart">
          <svg viewBox="0 0 400 200" preserveAspectRatio="none">
            {monthRecords.length > 1 && (() => {
              const sorted = [...monthRecords].sort((a, b) => a.date.localeCompare(b.date));
              const points = sorted.map((r, i) => {
                const x = (i / (sorted.length - 1)) * 380 + 10;
                const y = 190 - (r.duration / maxDuration) * 180;
                return { x, y, r };
              });

              const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

              const targetY = 190 - (targetMinutes / maxDuration) * 180;

              return (
                <>
                  <line x1="10" y1={targetY} x2="390" y2={targetY} stroke="rgba(239,83,80,0.3)" strokeDasharray="5,5" strokeWidth="1" />
                  <text x="392" y={targetY + 4} fill="rgba(239,83,80,0.5)" fontSize="8">目标</text>
                  <path d={pathD} fill="none" stroke="#4fc3f7" strokeWidth="2" />
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.r.duration < targetMinutes ? '#ef5350' : '#4fc3f7'} />
                  ))}
                </>
              );
            })()}
            {monthRecords.length <= 1 && (
              <text x="200" y="100" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14">数据不足</text>
            )}
          </svg>
        </div>
      </div>

      <div className="card">
        <div className="card-title">质量分布</div>
        <div className="distribution-bar">
          {qualityDist.map((count, i) => (
            <div
              key={i}
              className="distribution-segment"
              style={{
                width: `${(count / totalRecords) * 100}%`,
                background: qualityColors[i],
                display: count > 0 ? 'block' : 'none',
              }}
            />
          ))}
        </div>
        <div className="distribution-legend">
          {qualityDist.map((count, i) => (
            count > 0 && (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ background: qualityColors[i] }} />
                {i + 1}星 ({count}天)
              </div>
            )
          ))}
        </div>
      </div>

      {Object.keys(tagCount).length > 0 && (
        <div className="card">
          <div className="card-title">标签统计</div>
          <div className="tags-container">
            {Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
              <span key={tag} className="tag selected" style={{ cursor: 'default' }}>
                {tag} ({count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
