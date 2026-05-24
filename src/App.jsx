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
// Quiz Data with Custom Rendered Tables/Charts
// ==========================================
const quizData = [
  {
    id: 1,
    title: "原価計算の概要 原価の構成",
    question: "次の式の空欄Ａ、Ｂに入る用語の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n（ Ａ ）＝ 販売費及び一般管理費 ＋（ Ｂ ）",
    options: [
      "Ａ：製造原価 Ｂ：直接経費",
      "Ａ：製造原価 Ｂ：直接労務費",
      "Ａ：総原価 Ｂ：製造原価",
      "Ａ：製造直接費 Ｂ：直接労務費"
    ],
    answer: 2,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center font-bold text-gray-700 mb-2">◆原価の構成概念図</div>
        <div className="flex flex-col md:flex-row gap-1 text-center text-xs font-bold">
          <div className="border border-gray-400 bg-green-50 p-2 flex-1">
            <div>製造直接費</div>
            <div className="text-[10px] text-gray-500 font-normal">（直接材料費・直接労務費・直接経費）</div>
          </div>
          <div className="border border-gray-400 bg-yellow-50 p-2 flex-1">
            <div>製造間接費</div>
            <div className="text-[10px] text-gray-500 font-normal">（間接材料費・間接労務費・間接経費）</div>
          </div>
          <div className="border border-gray-400 bg-blue-50 p-2 flex-1 flex items-center justify-center">
            製造原価
          </div>
          <div className="border border-gray-400 bg-purple-50 p-2 flex-1 flex items-center justify-center">
            販売費及び一般管理費
          </div>
        </div>
        <div className="w-full border-t border-dashed border-gray-400 my-2"></div>
        <div className="bg-orange-100 p-2 text-center text-sm font-bold border border-orange-300 rounded">
          全体 ＝ 総原価
        </div>
      </div>
    ),
    explanation: "【解答】ウ\n原価を広く捉えた「総原価」は、製造活動にかかった「製造原価」と、販売・管理活動にかかった「販売費及び一般管理費」の合計で構成されます。したがって、Ａ：総原価、Ｂ：製造原価 となります。"
  },
  {
    id: 2,
    title: "原価計算の概要 製造原価の分類",
    question: "文章は、製造原価要素の分類について述べたものである。空欄Ａ、Ｂに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n原価発生の形態によって、原価要素は（ Ａ ）に属する各費目に分類される。また製品に対する原価発生の態様との関連によって、原価要素は（ Ｂ ）とに分類される。",
    options: [
      "Ａ：固定費、変動費 Ｂ：直接費と間接費",
      "Ａ：直接費と間接費 Ｂ：材料費、労務費、経費",
      "Ａ：材料費、労務費、経費 Ｂ：直接費と間接費",
      "Ａ：材料費、労務費、経費 Ｂ：固定費、変動費"
    ],
    answer: 2,
    renderCustomUI: () => (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-gray-300 p-2">分類基準</th>
              <th className="border border-gray-300 p-2">製造直接費</th>
              <th className="border border-gray-300 p-2">製造間接費</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50">材料費</td>
              <td className="border border-gray-300 p-2">直接材料費</td>
              <td className="border border-gray-300 p-2">間接材料費</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50">労務費</td>
              <td className="border border-gray-300 p-2">直接労務費</td>
              <td className="border border-gray-300 p-2">間接労務費</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold bg-gray-50">経費</td>
              <td className="border border-gray-300 p-2">直接経費</td>
              <td className="border border-gray-300 p-2">間接経費</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    explanation: "【解答】ウ\n・原価発生の形態による分類（財務会計を基礎とするもの）＝「材料費、労務費、経費」\n・製品に対する原価発生の態様（特定の製品と紐づくか）＝「直接費と間接費」\nこの2つの軸を整理しておくことが基本です。"
  },
  {
    id: 3,
    title: "非原価項目",
    question: "原価計算上、原価に算入されないもの（非原価項目）として、最も不適切なものはどれか。",
    options: [
      "支払利息などの財務費用は、原価に算入されない。",
      "異常な棚卸減耗は、原価に算入されない。",
      "工場の機械にかかる固定資産税は、原価に算入されない。",
      "法人税や所得税は、原価に算入されない。"
    ],
    answer: 2,
    explanation: "【解答】ウ\n工場の機械にかかる固定資産税は、製品を製造するために不可欠な費用（公租公課）であるため、「製造間接費（製造原価）」として原価に算入されます。したがって「算入されない」とする記述は誤り（不適切）です。\nそれ以外の支払利息（財務費用）、異常な棚卸減耗（異常な損失）、法人税（利益処分項目）はすべて原価に算入しない「非原価項目」にあたります。"
  },
  {
    id: 4,
    title: "製造原価報告書",
    question: "以下に掲げる製造原価報告書について、空欄Ａ～Ｄに入る組み合わせとして、最も適切なものはどれか。",
    options: [
      "Ａ：材料費 Ｂ：経費 Ｃ：当期総製造費用 Ｄ：当期製品製造原価",
      "Ａ：材料費 Ｂ：労務費 Ｃ：当期総製造費用 Ｄ：当期製品製造原価",
      "Ａ：材料費 Ｂ：労務費 Ｃ：当期製品製造原価 Ｄ：当期総製造費用",
      "Ａ：経費 Ｂ：労務費 Ｃ：当期総製造費用 Ｄ：当期製品製造原価"
    ],
    answer: 1,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg font-mono text-xs shadow-inner">
        <div className="text-center font-bold text-sm border-b pb-2 mb-2">製造原価報告書</div>
        <div>Ⅰ（  Ａ  ）</div>
        <div className="pl-4">1 期首材料棚卸高    ×××</div>
        <div className="pl-4">2 当期材料仕入高    ×××</div>
        <div className="pl-8 border-b w-32 ml-4">合計        ×××</div>
        <div className="pl-4">3 期末材料棚卸高    ×××</div>
        <div className="pl-8 text-right font-bold">当期材料費： ×××</div>
        
        <div className="mt-2">Ⅱ（  Ｂ  ）</div>
        <div className="pl-4">1 賃金         ×××</div>
        <div className="pl-4">2 法定福利費      ×××</div>
        <div className="pl-8 text-right font-bold">当期（ Ｂ ）： ×××</div>

        <div className="mt-2">Ⅲ 経費</div>
        <div className="pl-4">1 外注加工費      ×××</div>
        <div className="pl-4">2 福利厚生費      ×××</div>
        <div className="pl-8 text-right font-bold border-b">当期経費： ×××</div>

        <div className="mt-2 pl-4 flex justify-between font-bold text-blue-700">
          <span>（  Ｃ  ）</span><span>×××</span>
        </div>
        <div className="pl-4 flex justify-between">
          <span>期首仕掛品棚卸高</span><span>×××</span>
        </div>
        <div className="pl-6 flex justify-between border-b w-1/2 ml-auto">
          <span>合 計</span><span>×××</span>
        </div>
        <div className="pl-4 flex justify-between">
          <span>期末仕掛品棚卸高</span><span>×××</span>
        </div>
        <div className="mt-1 pl-4 flex justify-between font-bold text-red-700 border-t-2 border-double border-gray-600">
          <span>（  Ｄ  ）</span><span>×××</span>
        </div>
      </div>
    ),
    explanation: "【解答】イ\n製造原価報告書（CR）は、材料費(A)・労務費(B)・経費を当期中にどれだけ投入したかを集計し、その合計である「当期総製造費用(C)」を出します。そこに期首仕掛品を足して期末仕掛品を引くことで、当期中に完成した製品の原価である「当期製品製造原価(D)」を計算します。"
  },
  {
    id: 5,
    title: "個別原価計算1",
    question: "個別原価計算に関する説明として、最も不適切なものはどれか。",
    options: [
      "製造間接費は、合理的な賦課基準に従って各製造指図書に賦課する。賦課というのは、全体の費用を、ある基準で各製造指図書に割り振ることをいう。",
      "個別原価計算は、個別の一つの注文ごとに生産する受注生産形態が採用されている。",
      "個別原価計算は、間接材料費、間接労務費、間接経費をまとめて計算する。",
      "製造間接費は一定の配賦基準に従い、各製造指図書に費用を配賦する。"
    ],
    answer: 0,
    explanation: "【解答】ア\n「賦課（直課）」とは、特定の製品にかかったことが明確な費用を直接その製品に負担させることです。一方で、複数の製品に共通して発生した全体の費用を、一定の基準で各製造指図書に割り振ることは「配賦」と呼びます。選択肢アは、配賦の説明を「賦課」と書いているため不適切（誤り）です。"
  },
  {
    id: 6,
    title: "個別原価計算2",
    question: "A社は個別原価計算制度を採用している。下の原価計算表の空欄を埋め、直接材料費と直接労務費の合計額に基づいて製造間接費を配賦するとき、当月の「製品製造原価」と「月末仕掛品」の組み合わせとして最も適切なものを選べ（単位：千円）。\n\n【製造状況】\n・製造指図書＃91：前月着手、当月完成\n・製造指図書＃92：前月着手、当月完成\n・製造指図書＃93：当月着手、当月未完成",
    options: [
      "製品製造原価 15,000 月末仕掛品 8,000",
      "製品製造原価 11,500 月末仕掛品 11,500",
      "製品製造原価 5,500 月末仕掛品 17,500",
      "製品製造原価 17,500 月末仕掛品 5,500"
    ],
    answer: 0,
    renderCustomUI: () => (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-400 text-center font-mono">
          <thead>
            <tr className="bg-orange-100 font-bold">
              <th className="border border-gray-400 p-2">原価要素</th>
              <th className="border border-gray-400 p-2">＃91</th>
              <th className="border border-gray-400 p-2">＃92</th>
              <th className="border border-gray-400 p-2">＃93</th>
              <th className="border border-gray-400 p-2 bg-orange-200">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">前月繰越</td>
              <td className="border border-gray-400 p-2">3,500</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
              <td className="border border-gray-400 p-2 font-bold">7,000</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">直接材料費</td>
              <td className="border border-gray-400 p-2">300</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
              <td className="border border-gray-400 p-2">1,700</td>
              <td className="border border-gray-400 p-2 font-bold">3,000</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">直接労務費</td>
              <td className="border border-gray-400 p-2">700</td>
              <td className="border border-gray-400 p-2">2,000</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
              <td className="border border-gray-400 p-2 font-bold">5,000</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">製造間接費</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
              <td className="border border-gray-400 p-2">3,000</td>
              <td className="border border-gray-400 p-2">4,000</td>
              <td className="border border-gray-400 p-2 bg-yellow-50 text-gray-400">（  ）</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-400 p-2">合計</td>
              <td className="border border-gray-400 p-2">（  ）</td>
              <td className="border border-gray-400 p-2">（  ）</td>
              <td className="border border-gray-400 p-2">（  ）</td>
              <td className="border border-gray-400 p-2">（  ）</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    explanation: "【解答】ア\n1. ＃93は当月着手なので「前月繰越」は0。よって＃92の前月繰越＝7,000－3,500＝3,500。\n2. ＃92の直接材料費＝3,000－300－1,700＝1,000。\n3. ＃93の直接労務費＝5,000－700－2,000＝2,300。\n4. 製造間接費は「直接材料費＋直接労務費」に比例して配賦されます。＃92の直材＋直労＝1,000＋2,000＝3,000に対して間接費は3,000（つまり配賦率100%）。よって＃91の間接費は、直材＋直労（300＋700＝1,000）の100%なので1,000と求まります。\n5. 集計すると、完成した＃91合計＝5,500、＃92合計＝9,500。未完成の＃93合計＝8,000。製品製造原価は5,500＋9,500＝15,000、月末仕掛品は8,000となります。"
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
    explanation: "【解答】エ\n総合原価計算の基本構造（ボックス図）をイメージしてください。左側（借方）の合計と右側（貸方）の合計は必ず一致します。したがって、当期投入数量は「完成品数量 ＋ 期末仕掛品数量 － 期首仕掛品数量」となります。控除（引き算）ではなく、足し算が必要なため不適切です。"
  },
  {
    id: 8,
    title: "総合原価計算2",
    question: "M社は甲製品を単一工程で大量生産している。材料はすべて工程の始点で投入している。次の資料に基づき、当月分の甲製品の「完成品原価」として最も適切なものを選べ（単位：千円）。\n\n＜数量データ＞ ※（ ）内は加工進捗度\n・月初仕掛品： 0 kg\n・当月投入： 1,000 kg\n・月末仕掛品： 400 kg（50％）\n・完成品： 600 kg\n\n＜原価データ＞\n・当月製造費用：直接材料費 10,000千円 / 加工費 8,000千円",
    options: [
      "10,000千円",
      "10,800千円",
      "12,000千円",
      "18,000千円"
    ],
    answer: 2,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-inner">
        <div className="text-center font-bold text-gray-700 mb-2">数量関係ボックス図（加工費は換算量に注意）</div>
        <div className="flex border-2 border-gray-700 h-32 w-64 mx-auto text-xs font-bold font-mono">
          <div className="w-1/2 border-r border-gray-700 flex flex-col justify-between p-1 bg-gray-50">
            <div>月初: 0kg</div>
            <div className="my-auto text-center bg-blue-100 p-1 border border-blue-300">当月投入:<br/>1,000kg</div>
          </div>
          <div className="w-1/2 flex flex-col justify-between text-right p-1">
            <div className="h-2/3 border-b border-gray-700 bg-gray-100 p-1 flex flex-col justify-between">
              <span>完成品:</span>
              <span className="text-center text-sm text-blue-700">600kg</span>
            </div>
            <div className="h-1/3 bg-orange-100 p-1 flex flex-col justify-between">
              <span>月末: 400kg</span>
              <span className="text-center text-orange-700">(進捗50% = 200kg)</span>
            </div>
          </div>
        </div>
      </div>
    ),
    explanation: "【解答】ウ\n1. 直接材料費の計算：始点投入のため月末仕掛品も100%投入済。単価＝10,000千円÷(600kg＋400kg)＝10千円。完成品直材費＝10千円×600kg＝6,000千円。\n2. 加工費の計算：加工費は進捗度を考慮した「完成品換算量」で按分します。月末換算量＝400kg×50%＝200kg。単価＝8,000千円÷(600kg＋200kg)＝10千円。完成品加工費＝10千円×600kg＝6,000千円。\n3. 合計：6,000 ＋ 6,000 ＝ 12,000千円 となります。"
  },
  {
    id: 9,
    title: "総合原価計算 期末仕掛品の原価",
    question: "M社は甲製品を単一工程で大量生産している。材料はすべて工程の始点で投入している。月末仕掛品の直接材料費は、先入先出法で行うときはＡ、平均法で行うときはＢになる。空欄Ａ・Ｂに入る金額の組み合わせを選べ。\n\n＜数量データ＞ ※（ ）内は加工進捗度\n・月初仕掛品：1,000 個\n・当月投入：6,000 個\n・月末仕掛品：2,000 個（50％）\n・完成品：5,000 個\n\n＜原価データ（直接材料費のみ抜粋）＞\n・月初仕掛品：435,000 円\n・当月投入：2,400,000 円",
    options: [
      "Ａ：800,000円 Ｂ：810,000円",
      "Ａ：835,000円 Ｂ：810,000円",
      "Ａ：800,000円 Ｂ：800,000円",
      "Ａ：835,000円 Ｂ：800,000円"
    ],
    answer: 0,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-inner">
        <div className="text-center font-bold text-gray-700 mb-2">直接材料費 ボックス図（個数と金額）</div>
        <div className="flex border-2 border-gray-700 h-36 w-72 mx-auto text-xs font-mono">
          <div className="w-1/2 border-r border-gray-700 flex flex-col font-bold">
            <div className="h-1/4 border-b border-gray-700 p-1 bg-yellow-50">月初: 1,000個<br/>(435,000円)</div>
            <div className="h-3/4 p-1 bg-blue-50 flex flex-col justify-center">当月投入: 6,000個<br/>(2,400,000円)</div>
          </div>
          <div className="w-1/2 flex flex-col justify-between text-right font-bold">
            <div className="h-3/5 border-b border-gray-700 bg-gray-100 p-1">完成品: 5,000個</div>
            <div className="h-2/5 bg-orange-100 p-1 text-left flex flex-col justify-between border-l-2 border-orange-400">
              <span className="text-right">月末仕掛品:</span>
              <span className="text-center text-sm text-orange-700">2,000個</span>
            </div>
          </div>
        </div>
      </div>
    ),
    explanation: "【解答】ア\n・先入先出法(A)：月末仕掛品2,000個はすべて「当月投入分」から成ると仮定します。当月単価＝2,400,000円÷6,000個＝400円。よって、400円×2,000個＝800,000円。\n・平均法(B)：月初と当月の材料費・数量をすべて均一にブレンドして単価を出します。平均単価＝(435,000＋2,400,000)÷(1,000＋6,000)＝2,835,000÷7,000＝405円。よって、405円×2,000個＝810,000円。"
  },
  {
    id: 10,
    title: "標準原価計算1 直接材料費の差異分析",
    question: "A社では標準原価計算制度を採用している。次の資料に基づいて、直接材料費差異を計算し、その金額として最も適切なものを選べ。\n\n① 直接材料費標準（製品1個あたり）： 5kg × ＠20千円 ＝ 100千円\n② 月実際直接材料費： 400kg × ＠22千円 ＝ 8,800千円\n③ 月生産数量： 月初仕掛品 10個、月末仕掛品 30個、完成品 70個",
    options: [
      "800千円（有利差異）",
      "800千円（不利差異）",
      "200千円（有利差異）",
      "200千円（不利差異）"
    ],
    answer: 2,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-inner">
        <div className="text-center font-bold text-gray-700 mb-2">材料費差異分析ボックス（外側が実際、内側が標準）</div>
        <div className="relative border-b-2 border-l-2 border-gray-700 w-64 h-40 mx-auto text-[10px] font-mono">
          {/* 実際枠 */}
          <div className="absolute bottom-0 left-0 w-48 h-32 border border-red-500 bg-red-50 opacity-40"></div>
          {/* 標準枠 */}
          <div className="absolute bottom-0 left-0 w-56 h-24 border border-blue-500 bg-blue-50 opacity-40"></div>
          
          {/* ラベル */}
          <div className="absolute left-[-35px] top-6 font-bold text-red-600">実際 @22</div>
          <div className="absolute left-[-35px] top-14 font-bold text-blue-600">標準 @20</div>
          
          <div className="absolute bottom-[-18px] left-36 font-bold text-red-600">実際 400kg</div>
          <div className="absolute bottom-[-18px] left-48 font-bold text-blue-600">標準 450kg</div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold text-gray-700 bg-white bg-opacity-75 p-1 rounded border">
            標準投入量 = 5kg × (70+30-10)個 = 450kg
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-5">※横軸：消費量(kg)、縦軸：価格(千円)</div>
      </div>
    ),
    explanation: "【解答】ウ\n1. 当月投入個数 ＝ 完成70 ＋ 月末30 － 月初10 ＝ 90個。\n2. 標準消費量 ＝ 5kg × 90個 ＝ 450kg。\n3. 数量差異 ＝ 標準価格＠20 × (標準450kg － 実際400kg) ＝ ＋1,000千円（消費量が少なくて済んだので有利差異）。\n4. 価格差異 ＝ (標準＠20 － 実際＠22) × 実際400kg ＝ －800千円（安く買えなかったので不利差異）。\n5. 総差異 ＝ 1,000(有利) － 800(不利) ＝ 200千円（有利差異）となります。"
  },
  {
    id: 11,
    title: "標準原価計算2 直接労務費の差異分析",
    question: "次の資料に基づき直接労務費差異（総差異）を計算し、その金額として最も適切なものを選べ。\n\n・標準：賃率 1,300円/時間、作業時間 190時間\n・実際：賃率 1,200円/時間、作業時間 220時間",
    options: [
      "22,000円（有利差異）",
      "22,000円（不利差異）",
      "17,000円（有利差異）",
      "17,000円（不利差異）"
    ],
    answer: 3,
    renderCustomUI: () => (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-400 text-center font-mono mb-4">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-gray-400 p-2" rowSpan="2"></th>
              <th className="border border-gray-400 p-2 col-span-2 bg-blue-50" colSpan="2">標準</th>
              <th className="border border-gray-400 p-2 col-span-2 bg-red-50" colSpan="2">実際</th>
            </tr>
            <tr className="bg-gray-50 text-xs">
              <th className="border border-gray-400 p-2">賃率</th>
              <th className="border border-gray-400 p-2">作業時間</th>
              <th className="border border-gray-400 p-2">賃率</th>
              <th className="border border-gray-400 p-2">作業時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">直接労務費</td>
              <td className="border border-gray-400 p-2 text-blue-700 font-bold">1,300円</td>
              <td className="border border-gray-400 p-2 text-blue-700">190時間</td>
              <td className="border border-gray-400 p-2 text-red-700 font-bold">1,200円</td>
              <td className="border border-gray-400 p-2 text-red-700">220時間</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    explanation: "【解答】エ\n1. 時間差異 ＝ 標準賃率 1,300円 × (標準 190h － 実際 220h) ＝ －39,000円（時間が超過したため不利差異）。\n2. 賃率差異 ＝ (標準 1,300円 － 実際 1,200円) × 実際 220h ＝ ＋22,000円（安く雇用できたため有利差異）。\n3. 直接労務費差異 ＝ －39,000 ＋ 22,000 ＝ －17,000円（不利差異）となります。"
  },
  {
    id: 12,
    title: "製造間接費",
    question: "次の「公式法変動予算（シュラッター・シュラッター法）」のグラフ図内の空欄①～④に入る語句の組み合わせとして、最も適切なものを選べ。",
    options: [
      "①変動費差異 ②能率費差異（変動費） ③予算差異 ④固定費実際発生額",
      "①変動費差異 ②能率費差異（変動費） ③固定費差異 ④固定費予算",
      "①変動費率 ②製造間接費実際発生額 ③予算差異 ④固定費予算",
      "①変動費率 ②能率費差異（変動費） ③変動費差異 ④固定費実際発生額"
    ],
    answer: 2,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-inner text-xs font-mono">
        <div className="text-center font-bold text-gray-700 mb-2">シュラッター・シュラッター図の再現</div>
        <div className="relative border-l-2 border-b-2 border-gray-800 w-full h-56 mx-auto pt-4">
          
          {/* 変動予算線 (斜め上) */}
          <div className="absolute bottom-0 left-0 w-full h-full border-t-2 border-gray-400 origin-bottom-left rotate-[20deg] text-right pr-4 pt-1 text-gray-500">変動予算線</div>
          {/* 固定費のベースライン */}
          <div className="absolute bottom-16 left-0 w-full border-t border-dashed border-gray-400"></div>
          
          {/* 縦線ライン群 */}
          <div className="absolute bottom-0 left-1/4 h-24 border-l border-gray-600 text-center pt-24">標準操業度</div>
          <div className="absolute bottom-0 left-1/2 h-36 border-l-2 border-blue-600 text-center pt-36 font-bold text-blue-700">実際操業度</div>
          <div className="absolute bottom-0 left-3/4 h-48 border-l border-gray-600 text-center pt-48">基準操業度</div>

          {/* 各種空欄インジケータ */}
          <div className="absolute bottom-2 left-2 font-bold text-purple-700 text-sm">①（角度）</div>
          <div className="absolute top-2 left-1/2 transform translate-x-2 font-bold text-red-600">②（最上部の縦幅）</div>
          <div className="absolute top-10 left-1/2 transform translate-x-2 font-bold text-orange-600">③（予算線と実際発生の差）</div>
          <div className="absolute bottom-4 left-3/4 transform translate-x-2 font-bold text-green-700">④（右端底部の固定の高さ）</div>
        </div>
        <div className="mt-6 p-2 bg-gray-50 border rounded text-gray-600 text-[11px]">
          ※図の位置関係を特定できるかが診断士試験でも非常に頻出のポイントです。
        </div>
      </div>
    ),
    explanation: "【解答】ウ\nシュラッター図の構造を問う定番問題です。\n① 斜め線の傾きは「変動費率」を表します。\n② 実際操業度上にプロットされた最上点の長さそのものは「製造間接費実際発生額」です。\n③ 実際発生額と予算許容額のズレを「予算差異」と呼びます。\n④ 基準操業度における固定費の枠、すなわち「固定費予算」の枠を示しています。"
  },
  {
    id: 13,
    title: "直接原価計算",
    question: "次の文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n直接原価計算とは製造にかかった費用を、（ Ａ ）、（ Ｂ ）に分解する。また販売にかかった費用も（ Ａ ）、（ Ｂ ）に分解する。売上高から変動売上原価を引いたものを（ Ｃ ）という。そして（ Ｃ ）から変動販売費を引いたものを（ Ｄ ）という。",
    options: [
      "Ａ：変動費 Ｂ：固定費 Ｃ：限界利益 Ｄ：変動製造マージン",
      "Ａ：変動費 Ｂ：固定費 Ｃ：変動製造マージン Ｄ：限界利益",
      "Ａ：直接費 Ｂ：間接費 Ｃ：売上総利益 Ｄ：限界利益",
      "Ａ：直接費 Ｂ：間接費 Ｃ：変動製造マージン Ｄ：限界利益"
    ],
    answer: 1,
    renderCustomUI: () => (
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-inner text-xs font-mono">
        <div className="text-center font-bold mb-2">直接原価計算によるP/L構造</div>
        <div className="border border-gray-400 rounded p-2 bg-gray-50 space-y-1">
          <div className="flex justify-between border-b p-1"><span>売上高</span><span>×××</span></div>
          <div className="flex justify-between border-b p-1 text-blue-700"><span>△ 変動売上原価</span><span>×××</span></div>
          <div className="flex justify-between border-b p-1 bg-blue-100 font-bold"><span>＝ 空欄（ Ｃ ）</span><span>×××</span></div>
          <div className="flex justify-between border-b p-1 text-blue-700"><span>△ 変動販売費</span><span>×××</span></div>
          <div className="flex justify-between border-b p-1 bg-green-100 font-bold"><span>＝ 空欄（ Ｄ ）</span><span>×××</span></div>
          <div className="flex justify-between p-1 text-red-700"><span>△ 固定費（固定製造費＋固定販管費）</span><span>×××</span></div>
          <div className="flex justify-between border-t-2 font-bold bg-orange-100 p-1"><span>＝ 営業利益</span><span>×××</span></div>
        </div>
      </div>
    ),
    explanation: "【解答】イ\n費用を「変動費(A)」と「固定費(B)」に明確に分解するのが直接原価計算の最大の特徴です。売上高から製造の変動費だけを差し引いたものが「変動製造マージン(C)」、そこからさらに販売費の変動マージンを引いた、すべての変動費を除いた利益を「限界利益(D)」と呼びます。"
  },
  {
    id: 14,
    title: "直接原価計算 限界利益と営業利益",
    question: "Y社の以下資料に基づいて、直接原価計算により計算された、「営業利益」と「限界利益」の組み合わせとして、最も適切なものを下記の解答群から選べ。\n\n・売上高： 5,000,000 円\n・変動製造費用： 2,450,000 円\n・固定製造費用： 300,000 円\n・変動販売費： 150,000 円\n・固定販売費： 125,000 円",
    options: [
      "営業利益 2,250,000 限界利益 1,975,000",
      "営業利益 1,975,000 限界利益 2,250,000",
      "営業利益 2,400,000 限界利益 1,975,000",
      "営業利益 1,975,000 限界利益 2,400,000"
    ],
    answer: 3,
    explanation: "【解答】エ\n1. 限界利益 ＝ 売上高 － すべての変動費 (変動製造費用 ＋ 変動販売費)\n   限界利益 ＝ 5,000,000 － (2,450,000 ＋ 150,000) ＝ 2,400,000 円\n2. 営業利益 ＝ 限界利益 － すべての固定費 (固定製造費用 ＋ 固定販売費)\n   営業利益 ＝ 2,400,000 － (300,000 ＋ 125,000) ＝ 1,975,000 円\nしたがって、営業利益 1,975,000、限界利益 2,400,000 となります。"
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

  if (activeQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <header className="flex justify-between items-center mb-8 pt-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            原価計算 スマート問題集
          </h1>
          <button onClick={() => setShowHistory(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center">
            <BarChart2 className="w-4 h-4 mr-1" /> 履歴一覧
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
        <div className="bg-white p-5 rounded-xl shadow-sm mb-4 whitespace-pre-wrap leading-relaxed text-gray-800 border-l-4 border-blue-500">
          <div className="text-xs text-gray-400 font-bold mb-1">【問題概要】 {currentQ.title}</div>
          {currentQ.question}
        </div>

        {/* 【画像代替】HTML/CSSでの図表・テーブルの再現差し込み */}
        {currentQ.renderCustomUI && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
            {currentQ.renderCustomUI()}
          </div>
        )}

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-gray-700 ";
            
            if (!isAnswered) {
              btnClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            } else {
              if (idx === currentQ.answer) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                btnClass += "bg-gray-50 border-gray-200 opacity-50";
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

        {/* 解答・解説 */}
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
                    className="w-5 h-5 mr-2 rounded text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                    checked={isReview || false}
                    onChange={toggleReview}
                  />
                  <span className="font-bold">この問題を「要復習」に追加</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* フローティングナビゲーション */}
      {isAnswered && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-lg">
          <button 
            onClick={handleNext}
            className="w-full max-w-2xl mx-auto flex justify-center items-center bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            {currentIndex < activeQuestions.length - 1 ? '次の問題へ' : '結果を確定して終了'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}