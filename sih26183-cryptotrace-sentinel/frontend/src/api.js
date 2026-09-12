const API_BASE = "http://localhost:8000/api/v1";

async function handle(res) {
  if (!res.ok) throw new Error(await res.text());
  return res;
}

export async function searchQuery(payload) {
  const res = await handle(await fetch(`${API_BASE}/search`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function expandNode(payload) {
  const res = await handle(await fetch(`${API_BASE}/graph/expand`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function startTrace(payload) {
  const res = await handle(await fetch(`${API_BASE}/trace/start`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function getTraceGraph(traceId) {
  const res = await handle(await fetch(`${API_BASE}/trace/${traceId}/graph`));
  return res.json();
}

export async function autoInvestigate(payload) {
  const res = await handle(await fetch(`${API_BASE}/investigate/auto`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function generateFreezeNotice(payload) {
  const res = await handle(await fetch(`${API_BASE}/reports/freeze-notice`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.blob();
}
