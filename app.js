import React, { useState, useRef } from "react";

export default function RankingApp() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const nameRef = useRef(null);
  const timeRef = useRef(null);

  const handleAdd = () => {
    if (!name || !time) return;
    const newRecord = { name, time: parseFloat(time) };
    const updatedRecords = [...records, newRecord]
      .sort((a, b) => a.time - b.time)
      .slice(0, 5);
    setRecords(updatedRecords);
    setName("");
    setTime("");
    nameRef.current.focus();
  };

  // 全角数字 → 半角
  const handleTimeChange = (e) => {
    const value = e.target.value;
    const half = value.replace(/[０-９．]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    setTime(half);
  };

  // CSV出力
  const exportCSV = () => {
    const csv =
      "順位,名前,タイム\n" +
      records.map((r, i) => `${i + 1},${r.name},${r.time.toFixed(2)}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ranking.csv";
    a.click();
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      if (field === "name") timeRef.current.focus();
      else handleAdd();
    } else if (e.key === "ArrowRight") {
      if (field === "name") timeRef.current.focus();
    } else if (e.key === "ArrowLeft") {
      if (field === "time") nameRef.current.focus();
    }
  };

  const avg = records.length
    ? (records.reduce((sum, r) => sum + r.time, 0) / records.length).toFixed(2)
    : "-";
  const best = records.length
    ? Math.min(...records.map((r) => r.time)).toFixed(2)
    : "-";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full text-green-900"
      style={{
        background: "linear-gradient(135deg, #c8f7dc 0%, #e2f9f1 100%)",
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        padding: "20px",
      }}
    >
      <div className="max-w-[1200px] min-h-[600px] bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 flex flex-col justify-start items-center p-12">
        <h1 className="text-4xl font-bold mb-6">Time Attack Ranking</h1>

        <ul className="w-full mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="flex justify-between border-b py-2 text-xl font-medium"
            >
              <span>{i + 1}位</span>
              <span>{records[i]?.name || "ーーー"}</span>
              <span>
                {records[i]?.time ? records[i].time.toFixed(2) + "秒" : "ーーー"}
              </span>
            </li>
          ))}
        </ul>

        <p className="mb-4">
          最高タイム：{best}秒　平均タイム：{avg}秒
        </p>

        <div className="w-full flex flex-col gap-4 mb-6">
          <input
            ref={nameRef}
            id="nameInput"
            type="text"
            placeholder="プレイヤー名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "name")}
            className="p-3 border rounded-lg text-lg w-full"
          />
          <input
            ref={timeRef}
            id="timeInput"
            type="text"
            placeholder="タイム（秒）"
            value={time}
            onChange={handleTimeChange}
            onKeyDown={(e) => handleKeyDown(e, "time")}
            className="p-3 border rounded-lg text-lg w-full"
          />
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition"
          >
            登録
          </button>
        </div>

        <p>参加人数：{records.length}人</p>
      </div>

      {/* 小さく目立たないCSVボタン */}
      <button
        onClick={exportCSV}
        className="fixed bottom-4 right-4 text-xs bg-gray-300/50 hover:bg-gray-400/70 text-gray-800 px-3 py-1 rounded-lg shadow-md transition"
      >
        CSV保存
      </button>
    </div>
  );
}
