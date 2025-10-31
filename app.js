function App() {
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [logs, setLogs] = React.useState([]);

  const handleSubmit = () => {
    if (!name || !time) return;
    const newLog = { name, time: parseFloat(time), date: new Date().toLocaleString() };
    setLogs([...logs, newLog]);
    setName("");
    setTime("");
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["名前,タイム,日時", ...logs.map((l) => `${l.name},${l.time},${l.date}`)].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "time_attack_log.csv";
    link.click();
  };

  const sorted = [...logs].sort((a, b) => a.time - b.time).slice(0, 5);
  const best =
    logs.length > 0 ? Math.min(...logs.map((l) => l.time)) : "-";
  const average =
    logs.length > 0
      ? (logs.reduce((sum, l) => sum + l.time, 0) / logs.length).toFixed(2)
      : "-";

  return (
    <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-white w-[700px]">
      <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">Time Attack Ranking</h1>

      {/* ランキング */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">🏁 TOP 5</h2>
        {sorted.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/30">
                <th className="py-1">順位</th>
                <th>プレイヤー名</th>
                <th>タイム（秒）</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l, i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-1">{i + 1}</td>
                  <td>{l.name}</td>
                  <td>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-300">まだ記録がありません。</p>
        )}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-300">最高タイム</div>
          <div className="text-lg font-bold">{best}</div>
        </div>
        <div className="bg-white/10 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-300">平均タイム</div>
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
          className="flex-1 px-3 py-2 rounded-lg text-black"
        />
        <input
          type="number"
          placeholder="タイム（秒）"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-32 px-3 py-2 rounded-lg text-black"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg"
        >
          登録
        </button>
      </div>

      {/* 下部ボタン */}
      <div className="flex justify-between text-sm text-gray-300 mt-4">
        <div>参加人数：{logs.length}人</div>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-lg"
        >
          CSV出力
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
