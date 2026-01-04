import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy,
  Factory,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// --- データ定義 (全14問: スマート問題集 2-5 原価計算) ---

const problemData = [
  {
    id: 1,
    category: "原価の構成",
    question: "次の式の空欄Ａ、Ｂに入る用語の組み合わせとして、最も適切なものはどれか。\n（　Ａ　）＝ 販売費及び一般管理費 ＋（　Ｂ　）",
    options: [
      "Ａ：製造原価　Ｂ：直接経費",
      "Ａ：製造原価　Ｂ：直接労務費",
      "Ａ：総原価　Ｂ：製造原価",
      "Ａ：製造直接費　Ｂ：直接労務費"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="text-sm mb-2">原価の階層構造を理解しましょう。</p>
      <div class="bg-blue-50 p-3 rounded text-xs space-y-1">
        <p><strong>製造原価：</strong> 製品の製造にかかった原価（材料費＋労務費＋経費）</p>
        <p><strong>総原価：</strong> 製造原価 ＋ 販売費及び一般管理費（販管費）</p>
      </div>
      <p class="mt-2 text-xs italic text-gray-600">※販売価格は、総原価に営業利益を足したものです。</p>
    `
  },
  {
    id: 2,
    category: "製造原価の分類",
    question: "原価発生の形態によって、原価要素は（　Ａ　）に属する各費目に分類される。また製品に対する原価発生の態様との関連によって、原価要素は（　Ｂ　）とに分類される。空欄に入る組み合わせを選べ。",
    options: [
      "Ａ：固定費、変動費　Ｂ：直接費と間接費",
      "Ａ：直接費と間接費　Ｂ：材料費、労務費、経費",
      "Ａ：材料費、労務費、経費　Ｂ：直接費と間接費",
      "Ａ：材料費、労務費、経費　Ｂ：固定費、変動費"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <div class="space-y-2 text-sm">
        <p><strong>形態別分類(A)：</strong> 財務会計上の発生に基づき「材料費」「労務費」「経費」に分けます。</p>
        <p><strong>製品との関連(B)：</strong> 特定の製品にいくらかかったか明確なものを「直接費」、明確でないものを「間接費」に分けます。</p>
      </div>
    `
  },
  {
    id: 3,
    category: "非原価項目",
    question: "原価計算上、原価に算入されないもの（非原価項目）として、最も不適切なものはどれか。",
    options: [
      "支払利息などの財務費用は、原価に算入されない。",
      "異常な棚卸減耗は、原価に算入されない。",
      "工場の機械にかかる固定資産税は、原価に算入されない。",
      "法人税や所得税は、原価に算入されない。"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="text-sm mb-2"><strong>ウ ×：</strong> 工場の機械にかかる固定資産税は「製造原価（経費）」として原価に算入されます。</p>
      <div class="text-xs text-gray-600">
        <p>● 算入されない項目：財務費用（支払利息）、異常な状態による損失（火災・盗難等）、法人税等、利益剰余金に関する項目（配当など）。</p>
      </div>
    `
  },
  {
    id: 4,
    category: "製造原価報告書",
    question: "製造原価報告書の構造において、空欄Ａ～Ｄに入る組み合わせとして適切なものを選べ。\n\nⅠ ( Ａ ) ＋ Ⅱ ( Ｂ ) ＋ Ⅲ 経費 ＝ ( Ｃ )\n( Ｃ ) ＋ 期首仕掛品 － 期末仕掛品 ＝ ( Ｄ )",
    options: [
      "Ａ：材料費　Ｂ：経費　Ｃ：当期総製造費用　Ｄ：当期製品製造原価",
      "Ａ：材料費　Ｂ：労務費　Ｃ：当期総製造費用　Ｄ：当期製品製造原価",
      "Ａ：材料費　Ｂ：労務費　Ｃ：当期製品製造原価　Ｄ：当期総製造費用",
      "Ａ：経費　Ｂ：労務費　Ｃ：当期総製造費用　Ｄ：当期製品製造原価"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <div class="bg-gray-100 p-2 rounded text-xs space-y-1">
        <p><strong>当期総製造費用(C)：</strong> 当期に投入した「材料費(A)＋労務費(B)＋経費」の合計。</p>
        <p><strong>当期製品製造原価(D)：</strong> 完成した製品の原価。「総製造費用 ＋ 期首仕掛品 － 期末仕掛品」で計算。</p>
      </div>
    `
  },
  {
    id: 5,
    category: "個別原価計算の基礎",
    question: "個別原価計算に関する説明として、最も不適切なものはどれか。",
    options: [
      "製造間接費は、合理的な賦課基準に従って各製造指図書に賦課する。",
      "個別原価計算は、個別の注文ごとに生産する受注生産形態が採用されている。",
      "個別原価計算は、間接材料費、間接労務費、間接経費をまとめて計算する。",
      "製造間接費は一定の配賦基準に従い、各製造指図書に費用を配賦する。"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="text-sm mb-2"><strong>ア ×：</strong> 賦課ではなく「配賦」の説明です。</p>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="border p-1"><strong>賦課：</strong>直接製品に負担させること。</div>
        <div class="border p-1"><strong>配賦：</strong>全体の費用を基準で割り振ること。</div>
      </div>
      <p class="text-xs mt-2 italic text-blue-600">※製造「間接」費は割り振る必要があるため「配賦」を行います。</p>
    `
  },
  {
    id: 6,
    category: "個別原価計算の計算",
    question: "A社は個別原価計算を採用。状況は以下の通り。\n・#91, #92：当月完成\n・#93：当月着手、未完成（前月繰越0）\n・製造間接費合計 8,000を直接材料費と直接労務費の合計(1:3:4)で配賦する。\n当月の製品製造原価(完成分)と月末仕掛品(未完成分)を求めよ。(単位：千円)",
    options: [
      "製品製造原価 15,000　月末仕掛品 8,000",
      "製品製造原価 11,500　月末仕掛品 11,500",
      "製品製造原価 5,500　月末仕掛品 17,500",
      "製品製造原価 17,500　月末仕掛品 5,500"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="text-xs space-y-1">
        <p><strong>1. 製造間接費の配賦：</strong> 合計8,000を#91(1,000), #92(3,000), #93(4,000)に配分。</p>
        <p><strong>2. 完成品(#91, #92)の原価：</strong></p>
        <p>#91：3,500(繰越)＋300＋700＋1,000 ＝ 5,500</p>
        <p>#92：3,500(繰越)＋1,000＋2,000＋3,000 ＝ 9,500</p>
        <p>→ 5,500 ＋ 9,500 ＝ <strong>15,000</strong></p>
        <p><strong>3. 未完成(#93)の原価：</strong></p>
        <p>0 ＋ 1,700 ＋ 2,300 ＋ 4,000 ＝ <strong>8,000</strong></p>
      </div>
    `
  },
  {
    id: 7,
    category: "総合原価計算の基礎",
    question: "総合原価計算に関する説明として、最も不適切なものはどれか。",
    options: [
      "総合原価計算では、直接材料費、加工費に分類して計算する。",
      "総合原価計算は、大量生産において採用される原価計算の方法である。",
      "加工費は加工の進捗度に比例して発生する。",
      "当期投入数量は、完成品から期末仕掛品を控除して求めることができる。"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <p class="text-sm"><strong>エ ×：</strong> 当期投入数量 ＝ <strong>完成品 ＋ 期末仕掛品 － 期首仕掛品</strong> です。</p>
      <p class="text-xs mt-2">● 加工費：直接労務費、直接経費、製造間接費の合計。進捗度に合わせて発生します。</p>
    `
  },
  {
    id: 8,
    category: "総合原価計算の計算",
    question: "大量生産の甲製品。月初仕掛品0kg。当月投入1,000kg。完成品600kg、月末仕掛品400kg(進捗度50%)。材料は始点投入。当月費用：材料10,000、加工8,000。完成品原価を求めよ。",
    options: [
      "10,000千円",
      "10,800千円",
      "12,000千円",
      "18,000千円"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <div class="text-xs space-y-2">
        <p><strong>1. 直接材料費：</strong> 10,000 ÷ (600＋400) × 600 ＝ <strong>6,000</strong></p>
        <p><strong>2. 加工費：</strong> 8,000 ÷ (600 ＋ 400×0.5) × 600<br/>＝ 8,000 ÷ 800 × 600 ＝ <strong>6,000</strong></p>
        <p><strong>3. 合計：</strong> 6,000 ＋ 6,000 ＝ <strong>12,000</strong></p>
      </div>
    `
  },
  {
    id: 9,
    category: "仕掛品の評価方法",
    question: "直接材料費について、先入先出法(A)と平均法(B)で月末仕掛品原価を求めよ。\n月初：1,000個(435,000円)、当月投入：6,000個(2,400,000円)、完成：5,000個、月末：2,000個。材料は始点投入。",
    options: [
      "Ａ：800,000円　Ｂ：810,000円",
      "Ａ：835,000円　Ｂ：810,000円",
      "Ａ：800,000円　Ｂ：800,000円",
      "Ａ：835,000円　Ｂ：800,000円"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="text-xs space-y-2">
        <p><strong>A. 先入先出法：</strong> 月末仕掛品は「当月投入分」から成ると考える。<br/>2,400,000 ÷ 6,000 × 2,000 ＝ <strong>800,000</strong></p>
        <p><strong>B. 平均法：</strong> 月初と当月を平均した単価を使う。<br/>(435,000 ＋ 2,400,000) ÷ (1,000 ＋ 6,000) ＝ 405円<br/>405 × 2,000 ＝ <strong>810,000</strong></p>
      </div>
    `
  },
  {
    id: 10,
    category: "標準原価：材料差異",
    question: "標準材料費：5kg×＠20 ＝ 100。実際：400kg×＠22 ＝ 8,800。投入個数：90個。直接材料費差異(合計)を求めよ。",
    options: [
      "800千円（有利差異）",
      "800千円（不利差異）",
      "200千円（有利差異）",
      "200千円（不利差異）"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <div class="text-xs space-y-1">
        <p><strong>数量差異：</strong> 20 × (5×90 － 400) ＝ 1,000(有利)</p>
        <p><strong>価格差異：</strong> (20 － 22) × 400 ＝ △800(不利)</p>
        <p><strong>合計：</strong> 1,000 － 800 ＝ <strong>200(有利)</strong></p>
      </div>
      <p class="text-xs mt-1 italic text-blue-600">※標準より安く、または少なく済めば「有利」です。</p>
    `
  },
  {
    id: 11,
    category: "標準原価：労務費差異",
    question: "標準：1,300円/時 × 190時間。実際：1,200円/時 × 220時間。直接労務費差異(合計)を求めよ。",
    options: [
      "22,000円（有利差異）",
      "22,000円（不利差異）",
      "17,000円（有利差異）",
      "17,000円（不利差異）"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <div class="text-xs space-y-1">
        <p><strong>時間差異：</strong> 1,300 × (190 － 220) ＝ △39,000(不利)</p>
        <p><strong>賃率差異：</strong> (1,300 － 1,200) × 220 ＝ 22,000(有利)</p>
        <p><strong>合計：</strong> △39,000 ＋ 22,000 ＝ <strong>△17,000(不利)</strong></p>
      </div>
    `
  },
  {
    id: 12,
    category: "製造間接費の分析",
    question: "シュラッター・シュラッター図の空欄①～④に入る組み合わせを選べ。\n① 角度部分　② 実際発生額と予算許容額の差　③ 予算許容額の線と実際操業度の交点付近　④ 右端の底辺部分",
    options: [
      "①変動費差異　②能率費差異（変動費）　③予算差異　④固定費実際発生額",
      "①変動費差異　②能率費差異（変動費）　③固定費差異　④固定費予算",
      "①変動費率　②製造間接費実際発生額　③予算差異　④固定費予算",
      "①変動費率　②能率費差異（変動費）　③変動費差異　④固定費実際発生額"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <p class="text-sm mb-2">シュラッター図の位置関係を整理しましょう。</p>
      <ul class="text-xs space-y-1">
        <li><strong>① 変動費率：</strong> 斜線の傾き。</li>
        <li><strong>③ 予算差異：</strong> 実際発生額と「予算許容額（固定費予算＋変動費率×実際操業度）」の差。</li>
        <li><strong>④ 固定費予算：</strong> グラフの縦軸（切片）部分。</li>
      </ul>
    `
  },
  {
    id: 13,
    category: "直接原価計算",
    question: "直接原価計算では費用を( A )( B )に分解する。売上高から変動売上原価を引いたものを( C )、さらに変動販売費を引いたものを( D )という。空欄に入る組み合わせを選べ。",
    options: [
      "Ａ：変動費　Ｂ：固定費　Ｃ：限界利益　Ｄ：変動製造マージン",
      "Ａ：変動費　Ｂ：固定費　Ｃ：変動製造マージン　Ｄ：限界利益",
      "Ａ：直接費　Ｂ：間接費　Ｃ：売上総利益　Ｄ：限界利益",
      "Ａ：直接費　Ｂ：間接費　Ｃ：変動製造マージン　Ｄ：限界利益"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      <div class="bg-blue-50 p-2 rounded text-xs space-y-1">
        <p><strong>変動製造マージン(C)：</strong> 売上高 － 変動売上原価</p>
        <p><strong>限界利益(D)：</strong> 変動製造マージン － 変動販売費（＝売上高 － 全変動費）</p>
      </div>
    `
  },
  {
    id: 14,
    category: "限界利益と営業利益",
    question: "売上 5,000,000。変動製造費 2,450,000、変動販売費 150,000。固定製造費 300,000、固定販売費 125,000。限界利益と営業利益を求めよ。",
    options: [
      "営業利益 2,250,000　限界利益 1,975,000",
      "営業利益 1,975,000　限界利益 2,250,000",
      "営業利益 2,400,000　限界利益 1,975,000",
      "営業利益 1,975,000　限界利益 2,400,000"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      <div class="text-xs space-y-2">
        <p><strong>1. 限界利益：</strong> 5,000,000 － (2,450,000＋150,000) ＝ <strong>2,400,000</strong></p>
        <p><strong>2. 営業利益：</strong> 2,400,000 － (300,000＋125,000) ＝ <strong>1,975,000</strong></p>
      </div>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [quizMode, setQuizMode] = useState('all'); 
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviewFlags, setReviewFlags] = useState({}); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('smart_quiz_2_5_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('smart_quiz_2_5_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_quiz_2_5_answers', JSON.stringify(userAnswers));
    localStorage.setItem('smart_quiz_2_5_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => userAnswers[p.id] && !userAnswers[p.id].isCorrect);
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: { answerIndex: optionIndex, isCorrect: isCorrect }
    }));
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const stats = useMemo(() => {
    const total = problemData.length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  if (currentScreen === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-8">
            <div className="inline-block bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
              財務・会計 2-5
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              <Factory className="w-7 h-7 text-orange-600" /> 原価計算マスター
            </h1>
            <p className="text-slate-400 text-xs mt-1">製造原価から標準・直接原価計算まで</p>
          </header>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-sm font-black mb-4 w-full flex items-center gap-2 text-slate-600">
              <Trophy className="w-4 h-4 text-yellow-500" /> 学習進捗
            </h2>
            <div className="w-44 h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '正解', value: stats.correctCount },
                      { name: '未クリア', value: stats.total - stats.correctCount },
                    ]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none"
                  >
                    <Cell fill="#f97316" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{Math.round((stats.correctCount/stats.total)*100)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center mt-4 w-full border-t border-slate-50 pt-4">
              <div>
                <p className="text-xl font-black text-orange-600">{stats.correctCount}<span className="text-xs text-slate-300">/{stats.total}</span></p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Solved</p>
              </div>
              <div>
                <p className="text-xl font-black text-orange-400">{stats.reviewCount}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Review</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <button onClick={() => startQuiz('all')} className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-xl hover:bg-black transition active:scale-95">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded-xl"><Play className="w-6 h-6" /></div>
                <div className="text-left"><div className="font-black">全問題を解く</div><div className="text-[10px] opacity-50 font-bold tracking-wider">合計 14問</div></div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => startQuiz('wrong')} className="p-4 bg-white border border-slate-100 text-red-600 rounded-3xl font-black text-xs flex flex-col items-center gap-2 hover:bg-red-50 transition active:scale-95">
                <RotateCcw className="w-4 h-4" /> 弱点補強
              </button>
              <button onClick={() => startQuiz('review')} className="p-4 bg-white border border-slate-100 text-orange-600 rounded-3xl font-black text-xs flex flex-col items-center gap-2 hover:bg-orange-50 transition active:scale-95">
                <CheckSquare className="w-4 h-4" /> 復習リスト
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-100">
          <div className="h-1 bg-slate-100"><div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quit</button>
            <div className="font-black text-slate-700 text-sm">Q.{currentProblemIndex + 1} <span className="text-slate-300">/</span> {filteredProblems.length}</div>
            <div className="text-[10px] font-black px-2 py-1 bg-orange-50 rounded text-orange-600 uppercase tracking-wider">{problem.category}</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-md font-bold leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-5 text-left rounded-3xl border-2 transition-all flex items-center gap-4 text-sm ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) btnClass += "bg-green-50 border-green-500 text-green-700 font-bold";
                else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700 opacity-70";
                else btnClass += "bg-white border-transparent opacity-30 shadow-none";
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-slate-200 active:scale-[0.98] font-medium";
              }
              return (
                <button key={idx} disabled={showExplanation} onClick={() => handleAnswer(idx)} className={btnClass}>
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${showExplanation && idx === problem.correctAnswer ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {['ア','イ','ウ','エ'][idx]}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className={`p-6 rounded-3xl border shadow-sm ${selectedOption === problem.correctAnswer ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-1.5 rounded-full ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {selectedOption === problem.correctAnswer ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className={`text-lg font-black ${selectedOption === problem.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedOption === problem.correctAnswer ? '正解です！' : '残念...'}
                  </div>
                </div>
                <div className="text-sm leading-relaxed text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-50" dangerouslySetInnerHTML={{ __html: problem.explanation }} />
                
                <label className="flex items-center gap-3 mt-4 p-3 bg-white border border-orange-50 rounded-2xl cursor-pointer shadow-sm">
                  <input type="checkbox" checked={!!reviewFlags[problem.id]} onChange={() => toggleReview(problem.id)} className="w-4 h-4 rounded border-slate-200 text-orange-500 focus:ring-orange-500" />
                  <span className="text-xs font-black text-slate-500">この問題を復習リストに追加</span>
                </label>
              </div>

              <button onClick={nextProblem} className="w-full p-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 hover:bg-black transition active:scale-95">
                {currentProblemIndex === filteredProblems.length - 1 ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => userAnswers[p.id]?.isCorrect).length;
    const score = Math.round((sessionCorrect / filteredProblems.length) * 100);

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full space-y-8 text-center animate-in zoom-in-90 duration-500">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(249,115,22,0.3)]">
              <BarChart3 className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-500 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter">Completed</div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">Mission Done!</h2>
            <div className="text-7xl font-black mb-4 tracking-tighter text-orange-500">{score}<span className="text-3xl font-bold text-white ml-1">%</span></div>
            <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Score: {sessionCorrect} / {filteredProblems.length}</p>
          </div>

          <button onClick={() => setCurrentScreen('menu')} className="w-full p-6 bg-white text-slate-900 font-black rounded-3xl shadow-xl hover:bg-slate-100 transition active:scale-95">
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}