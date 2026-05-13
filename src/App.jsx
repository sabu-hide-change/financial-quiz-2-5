// npm install lucide-react firebase

import React, { useState, useEffect } from 'react';
import { Check, X, Home, ChevronRight, BookOpen, Clock, AlertTriangle, Play, RefreshCw, BarChart2 } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ==========================================
// Firebase Configuration (環境変数を使用)
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const APP_ID = "QuizApp_02_05_CostAccounting";

// ==========================================
// Quiz Data
// ==========================================
const quizData = [
  {
    id: 1,
    title: "原価計算の概要 原価の構成",
    question: "次の式の空欄A、Bに入る用語の組み合わせとして、最も適切なものを下記の解答群から選べ。\n（ A ）＝ 販売費及び一般管理費 ＋（ B ）",
    options: [
      "A：製造原価　B：直接経費",
      "A：製造原価　B：直接労務費",
      "A：総原価　B：製造原価",
      "A：製造直接費　B：直接労務費"
    ],
    answer: 2,
    explanation: "【解答】ウ\n原価の構成について問われています。原価は大きく「製造原価」と「販売費及び一般管理費」に分類されます。\n・製造原価：製品の製造にかかった原価です。\n・販売費及び一般管理費：販売活動と管理活動にかかった原価です。\n・総原価：製造原価と販売費及び一般管理費を合計して、総原価と呼びます。よって、A：総原価、B：製造原価となります。"
  },
  {
    id: 2,
    title: "原価計算の概要 製造原価の分類",
    question: "文章は、製造原価要素の分類について述べたものである。空欄A、Bに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n原価発生の形態によって、原価要素は（ A ）に属する各費目に分類される。また製品に対する原価発生の態様との関連によって、原価要素は（ B ）とに分類される。",
    options: [
      "A：固定費、変動費　B：直接費と間接費",
      "A：直接費と間接費　B：材料費、労務費、経費",
      "A：材料費、労務費、経費　B：直接費と間接費",
      "A：材料費、労務費、経費　B：固定費、変動費"
    ],
    answer: 2,
    explanation: "【解答】ウ\n製造原価の分類について問われています。\n・費目別の分類（原価発生の形態による分類）：材料費、労務費、経費に分類されます。\n・製品との関連における分類（原価発生の態様による分類）：特定の製品にいくらかかったかが明確にわかる「製造直接費」と、明確ではない「製造間接費」に分類されます。"
  },
  {
    id: 3,
    title: "非原価項目",
    question: "原価計算上、原価に算入されないものとして、最も不適切なものはどれか。",
    options: [
      "支払利息などの財務費用は、原価に算入されない。",
      "異常な棚卸減耗は、原価に算入されない。",
      "工場の機械にかかる固定資産税は、原価に算入されない。",
      "法人税や所得税は、原価に算入されない。"
    ],
    answer: 2,
    explanation: "【解答】ウ\n工場の機械にかかる固定資産税は「製造原価」として原価に算入されます。したがって「算入されない」とする記述は不適切です。\n・ア：支払利息などの財務費用は、経営目的に関連しない価値の減少に該当し非原価項目です。\n・イ：異常な棚卸減耗は、異常な状態を原因とする価値の減少に該当し非原価項目です。\n・エ：法人税や所得税は、その他の利益剰余金に課する項目に該当し非原価項目です。"
  },
  {
    id: 4,
    title: "製造原価報告書",
    question: "製造原価報告書について、空欄A～Dに入る組み合わせとして、最も適切なものはどれか。\nⅠ ( A )\n  1 期首材料棚卸高\n  2 当期材料仕入高\nⅡ ( B )\n  1 賃金\n  2 法定福利費\nⅢ 経費\n( C )\n期首仕掛品棚卸高\n期末仕掛品棚卸高\n( D )",
    options: [
      "A：材料費 B：経費 C：当期総製造費用 D：当期製品製造原価",
      "A：材料費 B：労務費 C：当期総製造費用 D：当期製品製造原価",
      "A：材料費 B：労務費 C：当期製品製造原価 D：当期総製造費用",
      "A：経費 B：労務費 C：当期総製造費用 D：当期製品製造原価"
    ],
    answer: 1,
    explanation: "【解答】イ\n製造原価報告書の上部には、インプットの材料費、労務費、経費が表示されます。次に、これらのインプットを合計した「当期総製造費用」が計算されます。そして、一番下に「当期製品製造原価」が表示されます。\n当期総製造費用 ＝ 材料費 ＋ 労務費 ＋ 経費\n当期製品製造原価 ＝ 当期総製造費用 ＋ 期首仕掛品 ‐ 期末仕掛品"
  },
  {
    id: 5,
    title: "個別原価計算1",
    question: "個別原価計算に関する説明として、最も不適切なものはどれか。",
    options: [
      "製造間接費は、合理的な賦課基準に従って各製造指図書に賦課する。賦課というのは、全体の費用を、ある基準で各製造指図書に割り振ることをいう。",
      "個別原価計算は、個別の注文ごとに生産する受注生産形態が採用されている。",
      "個別原価計算は、間接材料費、間接労務費、間接経費をまとめて計算する。",
      "製造間接費は一定の配賦基準に従い、各製造指図書に費用を配賦する。"
    ],
    answer: 0,
    explanation: "【解答】ア\n「賦課」というのは、かかった費用を直接製品に負担させることをいいます。全体の費用を、ある基準で各製造指図書に割り振ることは「配賦」といいます。よってアの記述は不適切です。\n個別原価計算では、製造直接費は特定の製造指図書に「賦課」し、製造間接費は一定の基準に従って「配賦」します。"
  },
  {
    id: 6,
    title: "個別原価計算2",
    question: "直接材料費と直接労務費の合計額に基づいて製造間接費を配賦するとき、当月の製品製造原価と月末仕掛品の組み合わせとして、最も適切なものを選べ。\n【製造状況】\n#91: 前月着手、当月完成 (材料費300, 労務費700, 前月繰越3,500)\n#92: 前月着手、当月完成 (労務費2,000, 製造間接費3,000)\n#93: 当月着手、当月未完成 (材料費1,700, 製造間接費4,000)\n合計: 前月繰越7,000, 材料費3,000, 労務費5,000",
    options: [
      "製品製造原価 15,000　月末仕掛品 8,000",
      "製品製造原価 11,500　月末仕掛品 11,500",
      "製品製造原価 5,500　月末仕掛品 17,500",
      "製品製造原価 17,500　月末仕掛品 5,500"
    ],
    answer: 0,
    explanation: "【解答】ア\n未完成の#93が月末仕掛品、完成した#91と#92が製品製造原価となります。\n前月繰越の合計が7,000、#91が3,500、#93は当月着手なので0。よって#92は3,500。\n同様に差し引きで表を埋めると：\n#91合計＝5,500、#92合計＝9,500、#93合計＝8,000。\n製品製造原価 ＝ #91(5,500) ＋ #92(9,500) ＝ 15,000。\n月末仕掛品 ＝ #93(8,000)。"
  },
  {
    id: 7,
    title: "総合原価計算1",
    question: "総合原価計算に関する説明として、最も不適切なものはどれか。",
    options: [
      "総合原価計算では、直接材料費、加工費に分類して計算する。",
      "総合原価計算は、大量生産において採用される原価計算の方法である。",
      "加工費は加工の進捗度に比例して発生する。",
      "当期投入数量は、完成品から期末仕掛品を控除して求めることができる。"
    ],
    answer: 3,
    explanation: "【解答】エ\n当期投入数量は、「当期投入数量 ＝ 完成品 ＋ 期末仕掛品 － 期首仕掛品」で求められます。よって完成品から期末仕掛品を控除して求めるという記述は不適切です。"
  },
  {
    id: 8,
    title: "総合原価計算2",
    question: "甲製品を単一工程で大量生産している。材料はすべて工程の始点で投入。当月分の完成品原価はいくらか。\n当月投入1,000kg, 月末仕掛品400kg(50%), 完成品600kg。\n当月製造費用：直接材料費10,000千円、加工費8,000千円。月初仕掛品はゼロ。",
    options: [
      "10,000千円",
      "10,800千円",
      "12,000千円",
      "18,000千円"
    ],
    answer: 2,
    explanation: "【解答】ウ\n直接材料費の単価：10,000千円 ÷ (完成品600kg ＋ 月末仕掛品400kg) ＝ 10千円/kg\n直接材料費完成品原価：10千円 × 600kg ＝ 6,000千円\n加工費の月末仕掛品換算量：400kg × 50% ＝ 200kg\n加工費の単価：8,000千円 ÷ (完成品600kg ＋ 月末仕掛品200kg) ＝ 10千円/kg\n加工費完成品原価：10千円 × 600kg ＝ 6,000千円\n完成品原価 ＝ 6,000 ＋ 6,000 ＝ 12,000千円"
  },
  {
    id: 9,
    title: "総合原価計算 期末仕掛品の原価",
    question: "甲製品の製造。材料は始点投入。月末仕掛品の直接材料費は、先入先出法で行うときはA、平均法で行うときはBになる。\n月初仕掛品 1,000個 (材料費 435,000)\n当月投入 6,000個 (材料費 2,400,000)\n月末仕掛品 2,000個 (50%)\n完成品 5,000個",
    options: [
      "A：800,000円　B：810,000円",
      "A：835,000円　B：810,000円",
      "A：800,000円　B：800,000円",
      "A：835,000円　B：800,000円"
    ],
    answer: 0,
    explanation: "【解答】ア\n・先入先出法：月末仕掛品は当月投入分から構成されると考えます。当月投入分単価＝2,400,000÷6,000＝400円。月末仕掛品＝400円×2,000個＝800,000円(A)。\n・平均法：月初と当月の平均単価を求めます。(435,000＋2,400,000)÷(1,000＋6,000)＝405円。月末仕掛品＝405円×2,000個＝810,000円(B)。"
  },
  {
    id: 10,
    title: "標準原価計算1 直接材料費の差異分析",
    question: "直接材料費差異を計算せよ。材料は始点投入。\n① 標準：5kg×＠20千円＝100千円\n② 実際：400kg×＠22千円＝8,800千円\n③ 生産数量：月初10個、月末30個、完成品70個",
    options: [
      "800千円（有利差異）",
      "800千円（不利差異）",
      "200千円（有利差異）",
      "200千円（不利差異）"
    ],
    answer: 2,
    explanation: "【解答】ウ\n当月投入個数 ＝ 70 ＋ 30 － 10 ＝ 90個\n標準消費量 ＝ 5kg × 90個 ＝ 450kg\n数量差異 ＝ ＠20千円 × (450kg － 400kg) ＝ ＋1,000千円(有利)\n価格差異 ＝ (＠20千円 － ＠22千円) × 400kg ＝ －800千円(不利)\n直接材料費差異 ＝ 1,000 － 800 ＝ 200千円(有利差異)"
  },
  {
    id: 11,
    title: "標準原価計算2 直接労務費の差異分析",
    question: "直接労務費差異を計算せよ。\n標準：賃率1,300円/時間、作業時間190時間\n実際：賃率1,200円/時間、作業時間220時間",
    options: [
      "22,000円（有利差異）",
      "22,000円（不利差異）",
      "17,000円（有利差異）",
      "17,000円（不利差異）"
    ],
    answer: 3,
    explanation: "【解答】エ\n時間差異 ＝ 標準賃率1,300円 × (標準190時間 － 実際220時間) ＝ －39,000円(不利)\n賃率差異 ＝ (標準1,300円 － 実際1,200円) × 実際220時間 ＝ ＋22,000円(有利)\n直接労務費差異 ＝ －39,000 ＋ 22,000 ＝ －17,000円(不利差異)"
  },
  {
    id: 12,
    title: "製造間接費",
    question: "公式法変動予算（シュラッター・シュラッター法）の図における空欄①～④に入る語句の組み合わせを選べ。\n①原点からの傾き（変動費部分）\n②実際操業度の線と変動予算線の差のうち、予算線上と実際発生額との差\n③右肩上がりの線の総称などに関連する部分（この説明文は仮です。正しくは「予算差異」等の位置）\n④基準操業度における固定費の高さ",
    options: [
      "①変動費差異　②能率費差異（変動費）　③予算差異　④固定費実際発生額",
      "①変動費差異　②能率費差異（変動費）　③固定費差異　④固定費予算",
      "①変動費率　②製造間接費実際発生額　③予算差異　④固定費予算",
      "①変動費率　②能率費差異（変動費）　③変動費差異　④固定費実際発生額"
    ],
    answer: 2,
    explanation: "【解答】ウ\nシュラッター図において、原点からの傾き①は「変動費率」を示します。\n縦軸の高さを示す②は「製造間接費実際発生額」です。\n実際発生額と予算許容額との差③は「予算差異」です。\n固定費の総額を示す④は「固定費予算」です。"
  },
  {
    id: 13,
    title: "直接原価計算",
    question: "直接原価計算とは製造にかかった費用を、（ A ）、（ B ）に分解する。また販売にかかった費用も（ A ）、（ B ）に分解する。売上高から変動売上原価を引いたものを（ C ）という。そして（ C ）から変動販売費を引いたものを（ D ）という。",
    options: [
      "A：変動費 B：固定費 C：限界利益 D：変動製造マージン",
      "A：変動費 B：固定費 C：変動製造マージン D：限界利益",
      "A：直接費 B：間接費 C：売上総利益 D：限界利益",
      "A：直接費 B：間接費 C：変動製造マージン D：限界利益"
    ],
    answer: 1,
    explanation: "【解答】イ\n直接原価計算は、費用を「変動費(A)」と「固定費(B)」に分解します。売上高から変動売上原価を引いた利益が「変動製造マージン(C)」です。「変動製造マージン」から変動販売費を引いたものが「限界利益(D)」になります。限界利益は、売上高からすべての変動費を引いたものです。"
  },
  {
    id: 14,
    title: "直接原価計算 限界利益と営業利益",
    question: "直接原価計算により計算された、営業利益、限界利益の組み合わせを選べ。\n売上高：5,000,000円\n変動製造費用：2,450,000円\n固定製造費用：300,000円\n変動販売費：150,000円\n固定販売費：125,000円",
    options: [
      "営業利益 2,250,000　限界利益 1,975,000",
      "営業利益 1,975,000　限界利益 2,250,000",
      "営業利益 2,400,000　限界利益 1,975,000",
      "営業利益 1,975,000　限界利益 2,400,000"
    ],
    answer: 3,
    explanation: "【解答】エ\n限界利益 ＝ 売上高 － すべての変動費\n限界利益 ＝ 5,000,000 － 2,450,000 － 150,000 ＝ 2,400,000円\n営業利益 ＝ 限界利益 － すべての固定費\n営業利益 ＝ 2,400,000 － 300,000 － 125,000 ＝ 1,975,000円"
  }
];

// ==========================================
// Main Application Component
// ==========================================
export default function App() {
  const [authKey, setAuthKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [userData, setUserData] = useState({
    wrongList: [],
    reviewList: [],
    progressIndex: 0,
    progressMode: ""
  });

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentMode, setCurrentMode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // ------------------------------------------
  // Firebase Data Handling
  // ------------------------------------------
  const handleLogin = async () => {
    if (!authKey.trim()) {
      alert("合言葉を入力してください");
      return;
    }
    setLoading(true);
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      
      const docRef = doc(db, APP_ID, authKey);
      const docSnap = await getDoc(docRef);
      
      let fetchedData = { wrongList: [], reviewList: [], progressIndex: 0, progressMode: "" };
      if (docSnap.exists()) {
        fetchedData = { ...fetchedData, ...docSnap.data() };
      } else {
        await setDoc(docRef, fetchedData);
      }
      
      console.log("Data loaded:", fetchedData);
      setUserData(fetchedData);
      setIsLoggedIn(true);

      if (fetchedData.progressIndex > 0 && fetchedData.progressMode) {
        setShowResumeDialog(true);
      }
      
    } catch (error) {
      console.error("Login error:", error);
      alert("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData) => {
    try {
      const docRef = doc(db, APP_ID, authKey);
      await setDoc(docRef, newData, { merge: true });
      console.log("Data saved:", newData);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // ------------------------------------------
  // Quiz Flow Methods
  // ------------------------------------------
  const startMode = (mode) => {
    let filtered = [];
    if (mode === "all") {
      filtered = [...quizData];
    } else if (mode === "wrong") {
      filtered = quizData.filter(q => userData.wrongList?.includes(q.id));
    } else if (mode === "review") {
      filtered = quizData.filter(q => userData.reviewList?.includes(q.id));
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    setActiveQuestions(filtered);
    setCurrentMode(mode);
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setShowHistory(false);
    setShowResumeDialog(false);

    // 進捗リセット
    const newUserData = { ...userData, progressIndex: 0, progressMode: mode };
    setUserData(newUserData);
    saveData({ progressIndex: 0, progressMode: mode });
  };

  const resumeQuiz = () => {
    let filtered = [];
    const mode = userData.progressMode;
    if (mode === "all") filtered = [...quizData];
    else if (mode === "wrong") filtered = quizData.filter(q => userData.wrongList?.includes(q.id));
    else if (mode === "review") filtered = quizData.filter(q => userData.reviewList?.includes(q.id));

    if (filtered.length === 0 || userData.progressIndex >= filtered.length) {
       // 万が一状態がおかしい場合は最初から
       startMode("all");
       return;
    }

    setActiveQuestions(filtered);
    setCurrentMode(mode);
    setCurrentIndex(userData.progressIndex);
    setIsAnswered(false);
    setSelectedOption(null);
    setShowResumeDialog(false);
  };

  const resetAndStartOver = () => {
    const newUserData = { ...userData, progressIndex: 0, progressMode: "" };
    setUserData(newUserData);
    saveData({ progressIndex: 0, progressMode: "" });
    setShowResumeDialog(false);
  };

  const handleAnswer = (idx) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = idx === currentQ.answer;

    let newWrongList = [...(userData.wrongList || [])];
    if (!isCorrect && !newWrongList.includes(currentQ.id)) {
      newWrongList.push(currentQ.id);
    } else if (isCorrect && newWrongList.includes(currentQ.id)) {
      newWrongList = newWrongList.filter(id => id !== currentQ.id);
    }

    // 次に進むべきインデックスを保存
    const nextProgressIndex = currentIndex; // とりあえず現在のインデックス（次回開いた時はここからリトライでも良いし、次へ進めても良い。ここでは現在の問題を完了したとして次に進む状態を保存するか、現在の状態を保存するか）
    // 仕様：解答するたびにprogressIndexを保存。次の問題への遷移は「次へ」ボタンで行う。

    const newUserData = { 
      ...userData, 
      wrongList: newWrongList,
      progressIndex: currentIndex,
      progressMode: currentMode
    };
    
    setUserData(newUserData);
    saveData({ wrongList: newWrongList, progressIndex: currentIndex, progressMode: currentMode });
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      
      const newUserData = { ...userData, progressIndex: nextIdx };
      setUserData(newUserData);
      saveData({ progressIndex: nextIdx });
    } else {
      // 完走
      alert("すべての問題を終了しました！");
      const newUserData = { ...userData, progressIndex: 0, progressMode: "" };
      setUserData(newUserData);
      saveData({ progressIndex: 0, progressMode: "" });
      
      setActiveQuestions([]);
      setCurrentMode("");
    }
  };

  const toggleReview = () => {
    const currentQ = activeQuestions[currentIndex];
    let newReviewList = [...(userData.reviewList || [])];
    
    if (newReviewList.includes(currentQ.id)) {
      newReviewList = newReviewList.filter(id => id !== currentQ.id);
    } else {
      newReviewList.push(currentQ.id);
    }
    
    const newUserData = { ...userData, reviewList: newReviewList };
    setUserData(newUserData);
    saveData({ reviewList: newReviewList });
  };

  const goHome = () => {
    // 途中離脱時も進捗は保存されている前提
    setActiveQuestions([]);
    setCurrentMode("");
    setShowHistory(false);
    setShowResumeDialog(false);
  };

  // ------------------------------------------
  // Render Helpers
  // ------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        <RefreshCw className="animate-spin w-10 h-10 mr-3 text-blue-500" />
        <span className="text-xl font-bold">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2 text-gray-800">原価計算 スマート問題集</h1>
          <p className="text-gray-500 mb-6 text-sm">合言葉を入力して学習データを同期します</p>
          <input
            type="text"
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            placeholder="合言葉 (例: my-secret-key)"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ログインして開始
          </button>
        </div>
      </div>
    );
  }

  // 履歴画面
  if (showHistory) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <header className="flex justify-between items-center mb-6 bg-white p-4 shadow-sm rounded-lg">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
            学習履歴
          </h1>
          <button onClick={goHome} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Home className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3 border-b">No.</th>
                <th className="p-3 border-b">問題タイトル</th>
                <th className="p-3 border-b text-center">状態</th>
                <th className="p-3 border-b text-center">要復習</th>
              </tr>
            </thead>
            <tbody>
              {quizData.map((q) => {
                const isWrong = userData.wrongList?.includes(q.id);
                const isReview = userData.reviewList?.includes(q.id);
                return (
                  <tr key={q.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{q.id}</td>
                    <td className="p-3 font-medium text-gray-800">{q.title}</td>
                    <td className="p-3 text-center">
                      {isWrong ? (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">不正解</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">クリア</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isReview && <AlertTriangle className="w-5 h-5 text-yellow-500 inline-block" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 再開ダイアログ
  if (showResumeDialog) {
    const modeName = userData.progressMode === "all" ? "すべての問題" : userData.progressMode === "wrong" ? "前回不正解のみ" : "要復習のみ";
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-bold mb-4 text-gray-800">学習の続きから再開しますか？</h2>
          <p className="text-gray-600 mb-6 bg-gray-100 p-3 rounded text-sm text-left">
            モード: <strong>{modeName}</strong><br/>
            進捗: <strong>問題 {userData.progressIndex + 1}</strong>
          </p>
          <div className="space-y-3">
            <button onClick={resumeQuiz} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center hover:bg-blue-700">
              <Play className="w-5 h-5 mr-2" /> 続きから再開する
            </button>
            <button onClick={resetAndStartOver} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300">
              最初から始める
            </button>
          </div>
        </div>
      </div>
    );
  }

  // スタート画面
  if (activeQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <header className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            原価計算
          </h1>
          <button onClick={() => setShowHistory(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center">
            <BarChart2 className="w-4 h-4 mr-1" /> 履歴
          </button>
        </header>

        <div className="grid gap-4 max-w-md mx-auto">
          <button onClick={() => startMode("all")} className="bg-white border-2 border-blue-500 text-blue-700 font-bold py-4 rounded-xl shadow-sm hover:bg-blue-50 transition flex items-center justify-center">
            すべての問題 ({quizData.length}問)
          </button>
          
          <button onClick={() => startMode("wrong")} className="bg-white border-2 border-red-400 text-red-600 font-bold py-4 rounded-xl shadow-sm hover:bg-red-50 transition flex items-center justify-center">
            前回不正解の問題 ({userData.wrongList?.length || 0}問)
          </button>
          
          <button onClick={() => startMode("review")} className="bg-white border-2 border-yellow-400 text-yellow-600 font-bold py-4 rounded-xl shadow-sm hover:bg-yellow-50 transition flex items-center justify-center">
            要復習の問題 ({userData.reviewList?.length || 0}問)
          </button>
        </div>
      </div>
    );
  }

  // クイズ画面
  const currentQ = activeQuestions[currentIndex];
  const isCorrectAnswer = selectedOption === currentQ.answer;
  const isReview = userData.reviewList?.includes(currentQ.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={goHome} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 mr-3">
            <Home className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-gray-600 text-sm">
            問 {currentIndex + 1} / {activeQuestions.length}
          </span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-bold">
          {currentQ.title}
        </span>
      </header>

      <main className="flex-grow p-4 max-w-2xl mx-auto w-full pb-24">
        {/* 問題文 */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6 whitespace-pre-wrap leading-relaxed text-gray-800 border-l-4 border-blue-500">
          {currentQ.question}
        </div>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-gray-700 ";
            
            if (!isAnswered) {
              btnClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            } else {
              if (idx === currentQ.answer) {
                btnClass += "bg-green-50 border-green-500 text-green-800"; // 正解
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800"; // 選んだ不正解
              } else {
                btnClass += "bg-gray-50 border-gray-200 opacity-50"; // その他
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.answer && <Check className="text-green-500 w-5 h-5" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.answer && <X className="text-red-500 w-5 h-5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* 解説 */}
        {isAnswered && (
          <div className="mt-8 animate-fade-in-up">
            <div className={`p-4 rounded-t-xl font-bold flex items-center ${isCorrectAnswer ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isCorrectAnswer ? <Check className="w-6 h-6 mr-2" /> : <X className="w-6 h-6 mr-2" />}
              {isCorrectAnswer ? '正解！' : '不正解...'}
            </div>
            <div className="bg-white p-5 rounded-b-xl shadow-sm border border-t-0 border-gray-200">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                {currentQ.explanation}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <label className="flex items-center cursor-pointer text-gray-600 hover:text-yellow-600 transition">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 mr-2 rounded text-yellow-500 focus:ring-yellow-500"
                    checked={isReview || false}
                    onChange={toggleReview}
                  />
                  <span className="font-bold">要復習にする</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* フローティング「次へ」ボタン */}
      {isAnswered && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleNext}
            className="w-full max-w-2xl mx-auto flex justify-center items-center bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            {currentIndex < activeQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}