function App() {
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [logs, setLogs] = React.useState([]);

  // 全角数字を半角に変換
  const toHalfWidth = (str) =>
    str.replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));

  const handleSubmit = () => {
    const parsed = parseFloat(time);
    if (!name || isNaN(parsed)) return;

    const newLog = {
      name,
      time: parsed,
      date: new Date().toLocaleString(),
    };
    setLogs([...logs, newLog]);
    setName("");
    setTime("");
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["名前,タイム,日時", ...logs.map((l) => `${l.name},${l.time.toFixed(2)},${l.date}`)].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "time_attack_log.csv";
    link.click();
  };

  const sorted = [...logs].sort((a, b) => a.time - b.time).slice(0, 5);
  const best = logs.length > 0 ? Math.min(...logs.map((l) => l.time)).toFixed(2) : "-";
  const average =
    logs.length > 0
      ? (logs.reduce((sum, l) => sum + l.time, 0) / logs.length).toFixed(2)
      : "-";

  const handleKeyDownName = (e) => {
    if (e.key === "Enter") document.getElementById("timeInput").focus();
  };

  const handleKeyDownTime = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-gray-900 w-[700px] border border-white/20">
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide text-yellow-800">
        Time Attack Ranking
      </h1>

      {/* ランキング */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-yellow-700">🏁 TOP 5</h2>
        {sorted.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/30 text-yellow-800">
                <th className="py-1">順位</th>
                <th>プレイヤー名</th>
                <th>タイム（秒）</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l, i) => (
                <tr key={i} className="border-b border-white/20">
                  <td className="py-1">{i + 1}</td>
                  <td>{l.name}</td>
                  <td>{l.time.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-yellow-600">まだ記録がありません。</p>
        )}
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/40 p-3 rounded-lg text-center">
          <div className="text-sm text-yellow-800">最高タイム</div>
          <div className="text-lg font-bold">{best}</div>
        </div>
        <div className="bg-white/40 p-3 rounded-lg text-center">
          <div className="text-sm text-yellow-800">平均タイム</div>
          <div className="text-lg font-bold">{average}</div>
        </div>
      </div>

      {/* 入力フォーム */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="プレイヤー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDownName}
          className="flex-1 px-3 py-2 rounded-lg text-gray-900"
        />
        <input
          id="timeInput"
          type="text"
          placeholder="タイム（秒）"
          value={time}
          onChange={(e) => setTime(toHalfWidth(e.target.value))}
          onKeyDown={handleKeyDownTime}
          className="w-32 px-3 py-2 rounded-lg text-gray-900"
        />
        <button
          onClick={handleSubmit}
          className="bg-yellow-500 hover:bg-yellow-400 transition px-4 py-2 rounded-lg"
        >
          登録
        </button>
      </div>

      {/* 下部 */}
      <div className="flex justify-between text-sm text-yellow-700 mt-4">
        <div>参加人数：{logs.length}人</div>
        <button
          onClick={handleExport}
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs"
        >
          CSV出力
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
