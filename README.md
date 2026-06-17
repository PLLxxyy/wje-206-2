# 睡眠质量追踪 (Sleep Quality Tracker)

一个基于浏览器的睡眠质量追踪应用，帮助你记录和分析每晚的睡眠数据。

## 功能特性

- **首页**：查看昨晚睡眠数据，包括入睡时间、起床时间、睡眠时长、质量评分（1-5星）
- **记录睡眠**：输入入睡和起床时间，选择质量评分和睡眠标签（多梦、失眠、打鼾、起夜等）
- **周统计**：展示每天睡眠时长柱状图和平均睡眠时间
- **月度统计**：睡眠趋势折线图和质量分布饼图
- **目标设置**：设置目标睡眠时长，未达标自动标红提醒
- **本地存储**：所有数据存储在浏览器 localStorage 中

## 技术栈

- Vite + React 18 + TypeScript
- localStorage 数据持久化
- 纯 CSS 样式（无第三方 UI 库）

## 快速开始

```bash
npm install
npm run dev
```

## 项目结构

```
src/
  App.tsx          # 主应用组件
  main.tsx         # 入口文件
  types.ts         # TypeScript 类型定义
  store.ts         # localStorage 数据管理
  pages/
    HomePage.tsx    # 首页
    AddSleepPage.tsx # 添加睡眠记录
    WeeklyPage.tsx  # 周统计
    MonthlyPage.tsx # 月度统计
    SettingsPage.tsx # 设置页面
```
