import { useState } from 'react';
import { saveRecord, calcDuration, generateId, getTodayStr } from '../store';
import { SleepRecord, SLEEP_TAGS } from '../types';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function AddSleepPage({ onClose, onSaved }: Props) {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState(getTodayStr());

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    const duration = calcDuration(bedTime, wakeTime);
    if (duration <= 0 || duration > 18 * 60) {
      alert('请输入有效的睡眠时间');
      return;
    }

    const record: SleepRecord = {
      id: generateId(),
      date,
      bedTime,
      wakeTime,
      duration,
      quality,
      tags: selectedTags,
      createdAt: Date.now(),
    };

    saveRecord(record);
    onSaved();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>记录睡眠</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>日期</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>入睡时间</label>
          <input
            type="time"
            value={bedTime}
            onChange={e => setBedTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>起床时间</label>
          <input
            type="time"
            value={wakeTime}
            onChange={e => setWakeTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>睡眠质量</label>
          <div className="quality-select">
            {[1, 2, 3, 4, 5].map(q => (
              <button
                key={q}
                className={`quality-btn ${quality === q ? 'selected' : ''}`}
                onClick={() => setQuality(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            {quality === 1 ? '很差' : quality === 2 ? '较差' : quality === 3 ? '一般' : quality === 4 ? '良好' : '优秀'}
          </div>
        </div>

        <div className="form-group">
          <label>睡眠标签（可多选）</label>
          <div className="tags-container">
            {SLEEP_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div className="duration-display" style={{ padding: '12px 0' }}>
            <div className="hours">
              {(calcDuration(bedTime, wakeTime) / 60).toFixed(1)}
              <span className="unit">小时</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          保存记录
        </button>
      </div>
    </div>
  );
}
