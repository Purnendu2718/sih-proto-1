const EXPLORER_LINKS = {
  TRON: (addr) => `https://tronscan.org/#/address/${addr}`,
  EVM: (addr) => `https://etherscan.io/address/${addr}`,
  BTC: (addr) => `https://mempool.space/address/${addr}`,
};

const TX_EXPLORER_LINKS = {
  TRON: (tx) => `https://tronscan.org/#/transaction/${tx}`,
  EVM: (tx) => `https://etherscan.io/tx/${tx}`,
  BTC: (tx) => `https://mempool.space/tx/${tx}`,
};

export default function ForensicDrawer({ node, transfers, onClose, onCopyAddress }) {
  if (!node) return null;

  const inbound = transfers.filter((t) => t.target === node.id);
  const outbound = transfers.filter((t) => t.source === node.id);

  const counterpartyTotals = (list, key) => {
    const totals = {};
    list.forEach((t) => { totals[t[key]] = (totals[t[key]] || 0) + t.amount; });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 text-gray-100 shadow-2xl overflow-y-auto z-50 border-l border-gray-700">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="font-semibold">{node.label}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="p-4 space-y-4 text-sm">
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">{node.id}</code>
          <button onClick={() => onCopyAddress(node.id)} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">
            Copy
          </button>
        </div>

        <a href={EXPLORER_LINKS[node.chain]?.(node.id) || "#"} target="_blank" rel="noreferrer"
          className="text-xs text-blue-400 hover:underline block">
          View on block explorer ↗
        </a>

        <div>
          <h4 className="text-xs uppercase text-gray-400 mb-2">Top Inbound Counterparties</h4>
          <table className="w-full text-xs">
            <tbody>
              {counterpartyTotals(inbound, "source").map(([addr, total]) => (
                <tr key={addr} className="border-b border-gray-700">
                  <td className="py-1 truncate max-w-[180px]">{addr}</td>
                  <td className="py-1 text-right">{total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-xs uppercase text-gray-400 mb-2">Top Outbound Counterparties</h4>
          <table className="w-full text-xs">
            <tbody>
              {counterpartyTotals(outbound, "target").map(([addr, total]) => (
                <tr key={addr} className="border-b border-gray-700">
                  <td className="py-1 truncate max-w-[180px]">{addr}</td>
                  <td className="py-1 text-right">{total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-xs uppercase text-gray-400 mb-2">Transaction Timeline</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="py-1">Time (UTC)</th>
                <th className="py-1">Amount</th>
                <th className="py-1">Tx</th>
              </tr>
            </thead>
            <tbody>
              {[...inbound, ...outbound]
                .sort((a, b) => b.timestamp_utc - a.timestamp_utc)
                .slice(0, 15)
                .map((t) => (
                  <tr key={t.tx_hash + t.source + t.target} className="border-b border-gray-700">
                    <td className="py-1">{new Date(t.timestamp_utc * 1000).toISOString().slice(0, 16).replace("T", " ")}</td>
                    <td className="py-1">{t.token_symbol} {t.amount.toLocaleString()}</td>
                    <td className="py-1">
                      <a href={TX_EXPLORER_LINKS[node.chain]?.(t.tx_hash) || "#"} target="_blank" rel="noreferrer"
                        className="text-blue-400 hover:underline">
                        {t.tx_hash.slice(0, 8)}…
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
