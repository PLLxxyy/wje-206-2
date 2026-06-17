import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../store';
import { AppSettings } from '../types';

export default function SettingsPage() {
  const [targetHours, setTargetHours] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSettings();
    setTargetHours(String(s.targetSleepHours));
  }, []);

  const handleSave = () => {
    const val = parseFloat(targetHours);
    if (isNaN(val) || val < 1 || val > 14) {
      alert('请输入1-14之间的有效时长');
      return;
    }
    const settings: AppSettings = { targetSleepHours: val };
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">目标睡眠时长</div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
          设置你的目标睡眠时长，未达标时会显示红色提醒
        </p>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <div className="target-input">
            <input
              type="number"
              value={targetHours}
              onChange={e => setTargetHours(e.target.value)}
              min="1"
              max="14"
              step="0.5"
            />
            <span>小时 / 晚</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[6, 6.5, 7, 7.5, 8, 8.5, 9].map(h => (
            <button
              key={h}
              className={`tag ${parseFloat(targetHours) === h ? 'selected' : ''}`}
              onClick={() => setTargetHours(String(h))}
            >
              {h}h
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '已保存 ✓' : '保存设置'}
        </button>
      </div>

      <div className="card">
        <div className="card-title">数据管理</div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
          所有数据保存在浏览器本地，清除浏览器数据将丢失记录
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (confirm('确定要导出数据吗？')) {
              const data = localStorage.getItem('sleep_records') || '[]';
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sleep-data-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
        >
          导出数据 (JSON)
        </button>
        <div style={{ height: 8 }} />
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (confirm('确定要清除所有睡眠记录吗？此操作不可恢复。')) {
              localStorage.removeItem('sleep_records');
              window.location.reload();
            }
          }}
        >
          清除所有数据
        </button>
      </div>
    </div>
  );
}
