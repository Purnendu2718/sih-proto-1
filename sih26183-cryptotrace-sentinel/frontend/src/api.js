const API_BASE = typeof window !== "undefined" && window.location.origin.includes("8000")
  ? "/api/v1"
  : "http://localhost:8000/api/v1";

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

export async function saveCaseCanvas(caseId, payload) {
  const res = await handle(await fetch(`${API_BASE}/cases/${caseId}/canvas`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function getCaseCanvas(caseId) {
  const res = await handle(await fetch(`${API_BASE}/cases/${caseId}/canvas`));
  return res.json();
}

export async function listCases(limit = 50, offset = 0) {
  const res = await handle(await fetch(`${API_BASE}/cases?limit=${limit}&offset=${offset}`));
  return res.json();
}

export async function createCase(payload) {
  const res = await handle(await fetch(`${API_BASE}/cases`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function exportEvidencePdf(payload) {
  const res = await handle(await fetch(`${API_BASE}/reports/evidence-dossier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  const blob = await res.blob();
  const sha256 = res.headers.get("X-Evidence-SHA256") || "";
  const merkle = res.headers.get("X-Evidence-Merkle-Root") || "";
  const timestamp = res.headers.get("X-Evidence-Timestamp-UTC") || "";
  return { blob, sha256, merkle, timestamp };
}

export async function exportEvidenceJson(payload) {
  const res = await handle(await fetch(`${API_BASE}/reports/evidence-dossier/json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function detectClusters(payload) {
  const res = await handle(await fetch(`${API_BASE}/graph/detect-clusters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function updateEntityProvenance(address, provenance) {
  const res = await handle(await fetch(`${API_BASE}/vasp-attribution/provenance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, provenance }),
  }));
  return res.json();
}

export async function evaluateRiskScore(payload) {
  const res = await handle(await fetch(`${API_BASE}/risk/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function startBatchScreening(payload) {
  const res = await handle(await fetch(`${API_BASE}/screening/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function uploadScreeningFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await handle(await fetch(`${API_BASE}/screening/upload`, {
    method: "POST",
    body: formData,
  }));
  return res.json();
}

export async function getBatchJobStatus(jobId, offset = 0, limit = 100) {
  const res = await handle(await fetch(`${API_BASE}/screening/batch/${jobId}?offset=${offset}&limit=${limit}`));
  return res.json();
}

export async function getBatchJobResults(jobId, sanctionsOnly = false, minRisk = 0) {
  const params = new URLSearchParams();
  if (sanctionsOnly) params.set("sanctions_only", "true");
  if (minRisk > 0) params.set("min_risk", minRisk);
  const res = await handle(await fetch(`${API_BASE}/screening/batch/${jobId}/results?${params.toString()}`));
  return res.json();
}

export async function getSampleScreeningAddresses(count = 1000) {
  const res = await handle(await fetch(`${API_BASE}/screening/sample?count=${count}`));
  return res.json();
}

export function getBatchCsvDownloadUrl(jobId) {
  return `${API_BASE}/screening/batch/${jobId}/export/csv`;
}

export async function fetchTimelineSnapshots(payload) {
  const res = await handle(await fetch(`${API_BASE}/timeline/snapshots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function queryCaseAssistant(payload) {
  const url = payload.case_id 
    ? `${API_BASE}/cases/${encodeURIComponent(payload.case_id)}/chat`
    : `${API_BASE}/cases/assistant/chat`;
  const res = await handle(await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return res.json();
}

export async function publicLookup(query, chain = null) {
  const params = new URLSearchParams();
  params.set("query", query);
  if (chain) params.set("chain", chain);
  const res = await handle(await fetch(`${API_BASE}/public/lookup?${params.toString()}`));
  return res.json();
}



