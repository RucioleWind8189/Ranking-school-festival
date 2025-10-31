function App() {
  const [name, setName] = React.useState("");
  const [time, setTime] = React.useState("");
  const [logs, setLogs] = React.useState([]);

  const handleSubmit = () => {
    if (!name || !time) return;
    const newLog = { name, time, date: new Date().toLocaleString() };
    setLogs([...logs, newLog]);
    setName("");
    setTime("");
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["名前,タイム,日時", ...logs.map(l => `${l.name},${l.time},${l.date}`)].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "ranking_log.csv";
    link.click();
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[500px]">
      <h1 className="text-2xl font-bold text-center mb-6">文化祭ランキング</h1>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="タイム (秒)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white rounded py-2">
          登録
        </button>
      </div>

      <h2 className="text-lg font-semibold mt-6">ログ</h2>
      <div className="max-h-40 overflow-y-auto bg-gray-100 p-3 rounded text-sm">
        {logs.map((l, i) => (
          <div key={i}>
            {l.name} - {l.time}秒 - {l.date}
          </div>
        ))}
      </div>

      <button
        onClick={handleExport}
        className="bg-green-500 text-white mt-4 rounded py-1 w-full"
      >
        CSVで保存
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
