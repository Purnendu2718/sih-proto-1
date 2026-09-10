export default function FilterToolbar({ filters, onFiltersChange, layoutName, onLayoutChange, onExport, onResetLayout, onZoomToFit }) {
  const set = (patch) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-800 text-gray-200 px-4 py-2 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <label className="text-xs uppercase text-gray-400">Min USD</label>
        <input type="range" min={0} max={50000} step={50}
          value={filters.minUsd ?? 0} onChange={(e) => set({ minUsd: Number(e.target.value) })} />
        <span className="text-xs">${(filters.minUsd ?? 0).toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs uppercase text-gray-400">Token</label>
        <select className="bg-gray-700 text-gray-100 text-xs rounded px-2 py-1"
          value={filters.token || "ALL"} onChange={(e) => set({ token: e.target.value })}>
          <option value="ALL">All Tokens</option>
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs uppercase text-gray-400">From</label>
        <input type="date" className="bg-gray-700 text-xs rounded px-2 py-1"
          onChange={(e) => set({ startTs: e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : null })} />
        <label className="text-xs uppercase text-gray-400">To</label>
        <input type="date" className="bg-gray-700 text-xs rounded px-2 py-1"
          onChange={(e) => set({ endTs: e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : null })} />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {[["dag", "DAG Flow"], ["radial", "Radial"], ["force", "Force"]].map(([key, label]) => (
          <button key={key} onClick={() => onLayoutChange(key)}
            className={`text-xs px-2 py-1 rounded ${layoutName === key ? "bg-blue-600" : "bg-gray-700"}`}>
            {label}
          </button>
        ))}
        <button onClick={onZoomToFit} className="text-xs px-2 py-1 rounded bg-gray-700">Zoom to Fit</button>
        <button onClick={onResetLayout} className="text-xs px-2 py-1 rounded bg-gray-700">Reset Layout</button>
        <button onClick={() => onExport("png")} className="text-xs px-2 py-1 rounded bg-gray-700">Export PNG</button>
        <button onClick={() => onExport("svg")} className="text-xs px-2 py-1 rounded bg-gray-700">Export SVG</button>
      </div>
    </div>
  );
}
