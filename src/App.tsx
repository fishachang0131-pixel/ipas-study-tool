import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  BookOpen, 
  Trophy, 
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

// --- Data Structures ---
const WEEKS = [
  { label: "第一週", desc: "科目一：AI定義、治理、資料處理、機器學習基礎" },
  { label: "第二週", desc: "科目一：ML模型、深度學習、鑑別式/生成式AI、隱私法規" },
  { label: "第三週", desc: "科目二：No-code/Low-code、Prompt Engineering、AI導入規劃" },
  { label: "第四週", desc: "複習衝刺 + 模擬測驗 + 考前準備" },
];

const DAYS = [
  {w:0,d:1,topic:"AI 定義與分類",tag:"sci1",items:[
    "📖 閱讀：AI 的定義與分類（演進脈絡、AI vs ML vs DL）",
    "📖 閱讀：弱 AI、強 AI、超級 AI 比較",
    "✏️ 筆記：整理三大 AI 分類差異表",
    "🧩 刷題：L111 AI概念相關選擇題 10 題",
  ]},
  {w:0,d:2,topic:"AI 治理與倫理",tag:"sci1",items:[
    "📖 閱讀：AI 治理框架（L11102）",
    "📖 閱讀：AI 倫理原則、隱私、安全性",
    "📖 閱讀：台灣《人工智慧基本法》重點（2026/1/14 生效）",
    "✏️ 筆記：AI 治理三大核心原則整理",
    "🧩 刷題：AI 治理 + 倫理選擇題 15 題",
  ]},
  {w:0,d:3,topic:"資料基本概念",tag:"sci1",items:[
    "📖 閱讀：大數據定義與 5V 特性",
    "📖 閱讀：資料型態與結構（數值型、類別型、文字、影像）",
    "📖 閱讀：資料來源與收集方式",
    "✏️ 筆記：結構化 vs 非結構化資料比較表",
    "🧩 刷題：L11201 資料基本概念 10 題",
  ]},
  {w:0,d:4,topic:"資料處理與清洗",tag:"sci1",items:[
    "📖 閱讀：資料清洗流程（缺值、異常值、重複值處理）",
    "📖 閱讀：資料轉換與正規化概念",
    "📖 閱讀：特徵工程基礎概念",
    "✏️ 筆記：資料前處理流程圖",
    "🧩 刷題：資料處理流程選擇題 15 題",
  ]},
  {w:0,d:5,topic:"資料分析概念",tag:"sci1",items:[
    "📖 閱讀：描述性統計 vs 推斷性統計",
    "📖 閱讀：資料視覺化概念與工具",
    "📖 閱讀：EDA（探索性資料分析）流程",
    "🧩 刷題：L112 資料處理與分析 15 題",
    "🔁 複習：本週 Day 1–4 筆記快速回顧",
  ]},
  {w:0,d:6,topic:"機器學習基礎",tag:"sci1",items:[
    "📖 閱讀：機器學習定義與三大類型",
    "📖 閱讀：監督式學習（分類、回歸）概念與場景",
    "📖 閱讀：非監督式學習（分群、降維）概念",
    "✏️ 筆記：三大 ML 類型比較表",
    "🧩 刷題：機器學習基礎概念 15 題",
  ]},
  {w:0,d:7,topic:"第一週複習日",tag:"rev",items:[
    "🔁 複習：AI 定義、治理、倫理重點整理",
    "🔁 複習：資料處理流程快速回顧",
    "🔁 複習：機器學習三大類型",
    "🧩 刷題：第一週混合練習 20 題（計時）",
    "📊 自我評估：整理錯題，標記薄弱知識點",
  ]},
  {w:1,d:8,topic:"常見 ML 模型",tag:"sci1",items:[
    "📖 閱讀：決策樹、隨機森林概念",
    "📖 閱讀：線性回歸 / 邏輯回歸適用場景",
    "📖 閱讀：SVM、KNN 基本原理",
    "✏️ 筆記：各模型適用場景一覽表",
    "🧩 刷題：L113 機器學習模型 15 題",
  ]},
  {w:1,d:9,topic:"深度學習與神經網路",tag:"sci1",items:[
    "📖 閱讀：神經網路架構（輸入層、隱藏層、輸出層）",
    "📖 閱讀：CNN（影像辨識）、RNN（序列資料）概念",
    "📖 閱讀：深度學習 vs 機器學習差異",
    "✏️ 筆記：深度學習三大架構對照",
    "🧩 刷題：深度學習概念 10 題",
  ]},
  {w:1,d:10,topic:"模型評估與優化",tag:"sci1",items:[
    "📖 閱讀：評估指標（Accuracy、Precision、Recall、F1）",
    "📖 閱讀：過擬合 / 欠擬合問題與解法",
    "📖 閱讀：交叉驗證（Cross-validation）概念",
    "✏️ 筆記：評估指標公式與應用情境",
    "🧩 刷題：模型評估 15 題",
  ]},
  {w:1,d:11,topic:"鑑別式 AI vs 生成式 AI",tag:"sci1",items:[
    "📖 閱讀：鑑別式 AI（Discriminative AI）概念",
    "📖 閱讀：生成式 AI（Generative AI）概念與代表模型",
    "📖 閱讀：GAN、VAE、Transformer 基本原理",
    "✏️ 筆記：鑑別式 vs 生成式差異比較表",
    "🧩 刷題：L114 鑑別式 vs 生成式 15 題",
  ]},
  {w:1,d:12,topic:"AI 隱私安全與合規",tag:"sci1",items:[
    "📖 閱讀：資料隱私保護原則（L11203）",
    "📖 閱讀：AI 演算法偏見與公平性",
    "📖 閱讀：AI 安全風險（對抗攻擊、資料投毒）",
    "📖 閱讀：Human-in/over-the-loop 監督機制",
    "🧩 刷題：AI 隱私安全 15 題",
  ]},
  {w:1,d:13,topic:"科目一衝刺練習",tag:"sci1",items:[
    "🧩 刷題：科目一模擬練習 30 題（計時 75 分鐘）",
    "📊 對答案：計算答對率，目標 ≥ 70%",
    "🔁 複習：錯誤率高的章節重點再閱讀",
    "✏️ 筆記：整理高頻考點清單",
  ]},
  {w:1,d:14,topic:"科目一模擬測驗",tag:"mock",items:[
    "🎯 模擬測驗：科目一全範圍 50 題（計時 75 分鐘）",
    "📊 對答案分析：目標達標 ≥ 70 分",
    "🔁 弱點補強：針對錯題查閱對應章節",
    "✏️ 整理最後記憶點與速記卡",
  ]},
  {w:2,d:15,topic:"No-code / Low-code 概念",tag:"sci2",items:[
    "📖 閱讀：LCNC 基本概念與發展背景",
    "📖 閱讀：No-code vs Low-code 差異",
    "📖 閱讀：LCNC 的優勢、限制與 AI 民主化關聯",
    "✏️ 筆記：LCNC 應用場景整理",
    "🧩 刷題：L121 LCNC 概念 10 題",
  ]},
  {w:2,d:16,topic:"生成式 AI 基本概念",tag:"sci2",items:[
    "📖 閱讀：生成式 AI 定義、演進與代表工具",
    "📖 閱讀：LLM（大型語言模型）基本原理",
    "📖 閱讀：Prompt Engineering 提示詞工程基礎",
    "✏️ 筆記：Zero-shot / Few-shot 提示技巧",
    "🧩 刷題：L122 生成式 AI 基本概念 15 題",
  ]},
  {w:2,d:17,topic:"AI 工具實務應用",tag:"sci2",items:[
    "📖 閱讀：常見生成式 AI 工具比較（ChatGPT、Copilot、Gemini）",
    "📖 閱讀：文字、圖像、影片、語音生成工具分類",
    "📖 閱讀：善用生成式 AI 工具的策略",
    "✏️ 筆記：各類 AI 工具用途整理表",
    "🧩 刷題：AI 工具應用 15 題",
  ]},
  {w:2,d:18,topic:"生成式 AI 導入評估",tag:"sci2",items:[
    "📖 閱讀：企業導入 AI 前的評估框架（L12301）",
    "📖 閱讀：導入時機判斷、ROI 評估概念",
    "📖 閱讀：AI 試點（Pilot）專案規劃流程",
    "✏️ 筆記：導入評估五大面向整理",
    "🧩 刷題：生成式 AI 導入評估 15 題",
  ]},
  {w:2,d:19,topic:"生成式 AI 導入規劃",tag:"sci2",items:[
    "📖 閱讀：AI 專案規劃步驟（L12302）",
    "📖 閱讀：利害關係人管理與變革管理",
    "📖 閱讀：AI 導入成熟度模型",
    "✏️ 筆記：AI 專案規劃 checklist 整理",
    "🧩 刷題：L12302 導入規劃 15 題",
  ]},
  {w:2,d:20,topic:"AI 風險管理",tag:"sci2",items:[
    "📖 閱讀：生成式 AI 風險類型（幻覺、偏見、版權）",
    "📖 閱讀：AI 風險管理框架與緩解策略（L12303）",
    "📖 閱讀：企業 AI 治理與責任歸屬",
    "✏️ 筆記：AI 風險分類矩陣",
    "🧩 刷題：AI 風險管理 15 題",
  ]},
  {w:2,d:21,topic:"科目二週末練習",tag:"sci2",items:[
    "🧩 刷題：科目二模擬練習 30 題（計時 75 分鐘）",
    "📊 對答案：計算答對率，目標 ≥ 70%",
    "🔁 複習：錯題章節重點補強",
    "📊 雙科分數預測：評估是否達兩科平均 ≥ 70",
  ]},
  {w:3,d:22,topic:"科目一重點複習",tag:"rev",items:[
    "🔁 複習：AI 定義、分類、治理快速回顧",
    "🔁 複習：ML 三大類型 + 常見模型速記",
    "🔁 複習：模型評估指標（精確率/召回率）",
    "🧩 刷題：科目一高頻錯題重刷 20 題",
  ]},
  {w:3,d:23,topic:"科目二重點複習",tag:"rev",items:[
    "🔁 複習：Prompt Engineering 技巧整理",
    "🔁 複習：生成式 AI 導入規劃五大步驟",
    "🔁 複習：AI 風險管理重點",
    "🧩 刷題：科目二高頻錯題重刷 20 題",
  ]},
  {w:3,d:24,topic:"法規 + 政策專攻",tag:"rev",items:[
    "📖 閱讀：台灣《人工智慧基本法》重點條文",
    "📖 閱讀：EU AI Act 分類（了解概念即可）",
    "📖 閱讀：國科會 AI 戰略方向",
    "🧩 刷題：AI 法規政策題 15 題",
  ]},
  {w:3,d:25,topic:"模擬測驗 — 科目一",tag:"mock",items:[
    "🎯 模擬測驗：科目一全範圍 50 題（嚴格計時 75 分鐘）",
    "📊 對答案：目標 ≥ 70 分，記錄實際得分",
    "🔁 弱點分析：找出錯誤率 > 50% 的主題",
    "✏️ 最後補強筆記",
  ]},
  {w:3,d:26,topic:"模擬測驗 — 科目二",tag:"mock",items:[
    "🎯 模擬測驗：科目二全範圍 50 題（嚴格計時 75 分鐘）",
    "📊 對答案：目標 ≥ 70 分，計算兩科平均分",
    "🔁 弱點分析：生成式 AI 導入規劃是否熟練",
    "✏️ 最後補強筆記",
  ]},
  {w:3,d:27,topic:"最終衝刺",tag:"rev",items:[
    "🔁 瀏覽所有筆記重點（不看新內容）",
    "🔁 熟記高頻考點：Human-over-the-loop、AI 民主化、提示工程",
    "🧩 輕量刷題：各章各 5 題，保持手感",
    "😴 確認考場地點、時間、攜帶物品",
  ]},
  {w:3,d:28,topic:"考試日前準備",tag:"mock",items:[
    "✅ 確認准考證與身分證件已備妥",
    "✅ 確認考場位置與交通方式",
    "🔁 最後一遍錯題整理筆記（30 分鐘）",
    "😴 充分休息，不熬夜，保持最佳狀態",
    "🎯 正式考試！兩科平均 ≥ 70，單科 ≥ 60",
  ]},
];

const TAG_CFG: Record<string, { label: string; cls: string }> = {
  sci1: { label: "科目一", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  sci2: { label: "科目二", cls: "bg-green-100 text-green-700 border-green-200" },
  rev:  { label: "複習衝刺", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  mock: { label: "模擬測驗", cls: "bg-rose-100 text-rose-700 border-rose-200" },
};

const STORAGE_KEY = "ipas_planner_v2";

export default function App() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [activeWeek, setActiveWeek] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }
  }, [checked, isLoaded]);

  const stats = useMemo(() => {
    const total = DAYS.reduce((acc, day) => acc + day.items.length, 0);
    const done = Object.values(checked).filter(Boolean).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [checked]);

  const weekStats = useMemo(() => {
    return WEEKS.map((_, i) => {
      const weekDays = DAYS.filter(d => d.w === i);
      const total = weekDays.reduce((acc, d) => acc + d.items.length, 0);
      const done = weekDays.reduce((acc, d) => {
        return acc + d.items.filter((_, idx) => checked[`${d.d}-${idx}`]).length;
      }, 0);
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      return { total, done, pct };
    });
  }, [checked]);

  const toggleItem = (dayId: number, idx: number) => {
    const key = `${dayId}-${idx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => {
    if (confirm("確定要清除所有進度嗎？")) {
      setChecked({});
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-espresso text-cream px-3 py-1 rounded-lg font-serif font-bold text-sm tracking-widest">iPAS</div>
          <h1 className="text-xl font-serif font-bold text-ink">AI 應用規劃師初級 · 讀書計畫</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-serif font-bold text-green-700">{stats.pct}%</span>
            <span className="text-[10px] uppercase tracking-widest text-mocha font-bold">Overall Progress</span>
          </div>
          <button 
            onClick={resetAll}
            className="flex items-center gap-2 text-xs font-bold text-mocha hover:text-rose-600 transition-colors border border-sand px-3 py-1.5 rounded-full hover:border-rose-200"
          >
            <RotateCcw size={14} /> 重置進度
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-parchment border border-sand/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-mocha font-bold mb-2">28 Days Study Plan</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-4 leading-tight">
              iPAS <span className="text-espresso">AI 應用規劃師</span><br />一個月備考計畫
            </h2>
            <p className="text-sm text-mocha leading-relaxed max-w-lg mb-6">
              科目一：人工智慧基礎概論 · 科目二：生成式 AI 應用規劃<br />
              兩科平均 ≥ 70 分，且單科不低於 60 分即可取證
            </p>
            <div className="flex flex-wrap gap-2">
              {["📅 4 週計畫", "📝 每日閱讀 + 刷題", "🎯 2026 最新範圍"].map(tag => (
                <span key={tag} className="text-[10px] bg-sand/30 text-espresso px-3 py-1 rounded-full border border-sand/50 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full -mr-20 -mt-20" />
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
          {[
            { label: "已完成", value: stats.done, icon: CheckCircle2, color: "text-green-600" },
            { label: "總任務", value: stats.total, icon: BookOpen, color: "text-blue-600" },
            { label: "進度", value: `${stats.pct}%`, icon: Trophy, color: "text-amber-600" }
          ].map((stat, i) => (
            <div key={i} className="bg-parchment border border-sand/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <stat.icon size={18} className={`${stat.color} mb-2`} />
              <div className="text-xl font-serif font-bold text-ink">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-mocha font-bold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs font-bold text-mocha uppercase tracking-widest">Overall Completion</span>
          <span className="text-xs font-bold text-ink">{stats.done} / {stats.total} Tasks</span>
        </div>
        <div className="h-2 bg-sand/30 rounded-full overflow-hidden border border-sand/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.pct}%` }}
            className="h-full bg-gradient-to-r from-mocha/50 to-espresso rounded-full"
          />
        </div>
      </div>

      {/* Week Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {WEEKS.map((week, i) => (
          <button
            key={i}
            onClick={() => setActiveWeek(i)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
              activeWeek === i 
                ? "bg-espresso text-cream border-espresso shadow-md" 
                : "bg-parchment text-mocha border-sand/50 hover:border-mocha"
            }`}
          >
            {week.label}
            {weekStats[i].pct > 0 && (
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md ${activeWeek === i ? "bg-cream/20" : "bg-sand/50"}`}>
                {weekStats[i].pct}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Week Info */}
      <div className="bg-parchment/50 border border-sand/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-serif font-bold text-ink mb-1">{WEEKS[activeWeek].label}</h3>
          <p className="text-sm text-mocha">{WEEKS[activeWeek].desc}</p>
        </div>
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className="flex-1 h-1.5 bg-sand/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${weekStats[activeWeek].pct}%` }}
              className="h-full bg-green-600 rounded-full"
            />
          </div>
          <span className="text-sm font-serif font-bold text-green-700">{weekStats[activeWeek].pct}%</span>
        </div>
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {DAYS.filter(d => d.w === activeWeek).map((day, idx) => {
            const dayDone = day.items.filter((_, i) => checked[`${day.d}-${i}`]).length;
            const dayPct = Math.round((dayDone / day.items.length) * 100);
            const isAllDone = dayDone === day.items.length;
            const tag = TAG_CFG[day.tag];

            return (
              <motion.div
                key={day.d}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`bg-parchment border rounded-3xl p-6 shadow-sm transition-all ${
                  isAllDone ? "border-green-200 bg-green-50/30" : "border-sand/50"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-mocha font-bold mb-1">Day {day.d}</div>
                    <h4 className="text-lg font-serif font-bold text-ink">{day.topic}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${tag.cls}`}>
                    {tag.label}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {day.items.map((item, i) => {
                    const isChecked = !!checked[`${day.d}-${i}`];
                    return (
                      <li 
                        key={i}
                        onClick={() => toggleItem(day.d, i)}
                        className={`flex gap-3 cursor-pointer group select-none`}
                      >
                        <div className={`mt-0.5 shrink-0 transition-colors ${isChecked ? "text-green-600" : "text-latte group-hover:text-mocha"}`}>
                          {isChecked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </div>
                        <span className={`text-sm leading-relaxed transition-all ${isChecked ? "text-latte line-through" : "text-ink2"}`}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-sand/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dayPct}%` }}
                      className="h-full bg-green-600"
                    />
                  </div>
                  {isAllDone ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md border border-green-200">
                      COMPLETED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-mocha">
                      {dayDone} / {day.items.length}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-sand/30 text-center">
        <p className="text-xs text-mocha font-medium tracking-widest uppercase">
          iPAS AI 應用規劃師初級 · 28 Days Study Plan
        </p>
      </footer>
    </div>
  );
}
